import React from 'react';

export interface NotificationItem {
  id: string;
  type: 'friend_request' | 'like' | 'comment';
  fromUser: string;
  postId?: string;
  message: string;
  createdAt: string;
  read?: boolean;
}


interface NotificationProps {
  notifications: NotificationItem[];
}

export const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  return (
    <div className="w-80 max-w-full bg-white rounded-xl shadow-lg border border-gray-200 p-4">
      <h3 className="text-lg font-bold mb-3">Notifications</h3>
      {notifications.length === 0 ? (
        <div className="text-gray-500 text-sm text-center py-8">No notifications</div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {notifications.map((notif) => (
            <li key={notif.id} className={`py-3 px-1 flex items-start gap-3 ${notif.read ? 'opacity-60' : ''}`}>
              <div className="flex-1">
                <div className="text-sm">
                  <span className="font-semibold">{notif.fromUser}</span> {notif.message}
                </div>
                <div className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
