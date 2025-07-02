import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, Search, Users, User, ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  recipient: {
    _id: string;
    username: string;
    fullName: string;
    profilePicture?: string;
  };
  message: string;
  createdAt: string;
}

interface Friend {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

export const Chat: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchFriends();
    
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('join', user?.id);

    newSocket.on('newMessage', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        sender: data.senderId === user?.id ? user : selectedFriend,
        recipient: data.senderId === user?.id ? selectedFriend : user,
        message: data.message,
        createdAt: data.timestamp
      } as Message]);
    });

    return () => {
      newSocket.close();
    };
  }, [user]);

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend._id);
    }
  }, [selectedFriend]);

  const fetchFriends = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/friends', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (friendId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/messages/${friendId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const response = await fetch('http://localhost:5000/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          recipientId: selectedFriend._id,
          message: newMessage
        })
      });

      if (response.ok) {
        const sentMessage = await response.json();
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');

        // Send through socket for real-time delivery
        if (socket) {
          socket.emit('sendMessage', {
            recipientId: selectedFriend._id,
            message: newMessage,
            senderId: user?.id
          });
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-sm h-[600px] animate-pulse">
          <div className="flex h-full">
            <div className="w-1/3 border-r border-gray-200 p-4">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="h-full bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 md:pb-4">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden h-[600px]">
        <div className="flex h-full">
          {/* Friends List */}
          <div className={`${selectedFriend ? 'hidden md:block' : 'block'} w-full md:w-1/3 border-r border-gray-200`}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-full">
              {friends.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
                  <p className="text-gray-600">Add friends to start chatting!</p>
                </div>
              ) : (
                <div className="p-2">
                  {friends.map((friend) => (
                    <button
                      key={friend._id}
                      onClick={() => setSelectedFriend(friend)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                        selectedFriend?._id === friend._id ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                        {friend.profilePicture ? (
                          <img
                            src={friend.profilePicture}
                            alt={friend.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{friend.fullName}</h3>
                        <p className="text-sm text-gray-500 truncate">@{friend.username}</p>
                      </div>
                    
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedFriend ? 'block' : 'hidden md:block'} flex-1 flex flex-col`}>
            {selectedFriend ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center">
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="md:hidden mr-3 p-2 hover:bg-gray-100 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                    {selectedFriend.profilePicture ? (
                      <img
                        src={selectedFriend.profilePicture}
                        alt={selectedFriend.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFriend.fullName}</h3>
                    <p className="text-sm text-gray-500">@{selectedFriend.username}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">Start your conversation with {selectedFriend.fullName}!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.sender._id === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.sender._id === user?.id
                              ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p>{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender._id === user?.id ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message ${selectedFriend.fullName}...`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="hidden md:flex flex-1 items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a friend to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};