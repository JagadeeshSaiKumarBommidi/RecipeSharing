import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Users, Clock, Award, Plus, Loader } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../context/AuthContext';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  emoji: string;
  startDate: string;
  endDate: string;
  prize: string;
  participantsCount: number;
  participants: Array<{
    user: {
      _id: string;
      username: string;
      fullName: string;
      profilePicture?: string;
    };
    joinedAt: string;
  }>;
  isActive: boolean;
  rules: string[];
  hashtags: string[];
}

// Snake Game Component
const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Snake properties
  const [snake, setSnake] = useState([
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
  ]);
  const [direction, setDirection] = useState("RIGHT");
  const [food, setFood] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(100);
  
  // Game constants
  const CANVAS_SIZE = { width: 400, height: 400 };
  const SCALE = 10;
  
  // Create random food position
  const createFood = useCallback(() => {
    // Create a grid position that doesn't overlap with the snake
    let newFoodPosition: { x: number; y: number };
    let overlapsWithSnake: boolean;
    
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * (CANVAS_SIZE.width / SCALE)) * SCALE,
        y: Math.floor(Math.random() * (CANVAS_SIZE.height / SCALE)) * SCALE
      };
      
      // Check if this position overlaps with any part of the snake
      overlapsWithSnake = snake.some(segment => 
        segment.x === newFoodPosition.x && segment.y === newFoodPosition.y
      );
    } while (overlapsWithSnake);
    
    return newFoodPosition;
  }, [CANVAS_SIZE.height, CANVAS_SIZE.width, SCALE, snake]);
  
  // Initialize game
  useEffect(() => {
    // Initialize canvas with a setTimeout to ensure DOM is ready
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Draw initial border
          ctx.strokeStyle = "#ddd";
          ctx.lineWidth = 2;
          ctx.strokeRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
        }
      }
    }, 100);
    
    // Only set food position if it hasn't been set yet (first render)
    if (food.x === 0 && food.y === 0) {
      setFood(createFood());
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent opposite directions
      switch(e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case " ": // Space key to pause/resume
          setIsPaused(prev => !prev);
          break;
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [createFood, direction, CANVAS_SIZE.width, CANVAS_SIZE.height, food.x, food.y]);
  
  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    
    if (!ctx) return;
    
    const gameInterval = setInterval(() => {
      ctx.clearRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
      
      // Draw food
      ctx.fillStyle = "red";
      ctx.fillRect(food.x, food.y, SCALE, SCALE);
      
      // Move snake
      const newSnake = [...snake];
      const head = { ...newSnake[0] };
      
      switch(direction) {
        case "UP":
          head.y -= SCALE;
          break;
        case "DOWN":
          head.y += SCALE;
          break;
        case "LEFT":
          head.x -= SCALE;
          break;
        case "RIGHT":
          head.x += SCALE;
          break;
      }
      
      // Check boundary collision
      if (
        head.x < 0 || 
        head.x >= CANVAS_SIZE.width || 
        head.y < 0 || 
        head.y >= CANVAS_SIZE.height
      ) {
        setGameOver(true);
        return;
      }
      
      // Check self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameOver(true);
          return;
        }
      }
      
      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setFood(createFood());
        setScore(prev => prev + 1);
        // Speed up slightly with each food
        if (speed > 50) setSpeed(prev => prev - 2);
      } else {
        newSnake.pop(); // Remove tail if not eating
      }
      
      newSnake.unshift(head); // Add new head
      setSnake(newSnake);
      
      // Draw snake
      ctx.fillStyle = "green";
      newSnake.forEach((segment) => {
        ctx.fillRect(segment.x, segment.y, SCALE, SCALE);
      });
      
      // Draw border
      ctx.strokeStyle = "#ddd";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height);
      
    }, speed);
    
    return () => clearInterval(gameInterval);
  }, [snake, food, direction, gameOver, createFood, isPaused, CANVAS_SIZE.height, CANVAS_SIZE.width, SCALE, speed]);
  
  const resetGame = () => {
    const initialSnake = [
      { x: 200, y: 200 },
      { x: 190, y: 200 },
      { x: 180, y: 200 },
      { x: 170, y: 200 },
      { x: 160, y: 200 },
    ];
    setSnake(initialSnake);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(100);
    setIsPaused(false);
    
    // Create new food position after resetting snake to avoid overlap
    setTimeout(() => {
      setFood(createFood());
    }, 10);
  };
  
  return (
    <div className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE.width} 
          height={CANVAS_SIZE.height}
          className="border-2 border-gray-200 bg-white"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <h3 className="text-white text-2xl font-bold mb-4">Game Over!</h3>
            <p className="text-white mb-4">Your score: {score}</p>
            <button 
              onClick={resetGame}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Play Again
            </button>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h3 className="text-white text-2xl font-bold">Paused</h3>
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between w-full max-w-md">
        <p className="text-lg font-semibold">Score: {score}</p>
        <div className="space-x-2">
          {!gameOver && (
            <button 
              onClick={() => setIsPaused(prev => !prev)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
          <button 
            onClick={resetGame}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            New Game
          </button>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>Use arrow keys to control the snake</li>
          <li>Eat the red food to grow and earn points</li>
          <li>Avoid hitting the walls or yourself</li>
          <li>Press Space to pause/resume the game</li>
        </ul>
      </div>
    </div>
  );
};

// TicTacToe Game Component
const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  
  // Check for winner
  useEffect(() => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        setWinner(board[a]);
        return;
      }
    }
    
    // Check for draw
    if (!board.includes(null) && !winner) {
      setWinner('draw');
    }
  }, [board, winner]);
  
  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };
  
  const renderSquare = (index: number) => {
    return (
      <button
        className={`w-20 h-20 text-3xl font-bold border border-gray-300 flex items-center justify-center ${
          board[index] === 'X' ? 'text-blue-600' : 
          board[index] === 'O' ? 'text-red-600' : 'hover:bg-gray-100'
        }`}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner}
      >
        {board[index]}
      </button>
    );
  };
  
  return (
    <div className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4">Tic Tac Toe</h2>
      
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-1">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        {winner ? (
          <div className="mb-4">
            <p className="text-xl font-bold">
              {winner === 'draw' 
                ? "It's a draw!" 
                : `Player ${winner} wins!`}
            </p>
            <button 
              onClick={resetGame}
              className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
            >
              Play Again
            </button>
          </div>
        ) : (
          <p className="text-lg font-semibold">
            Next player: <span className={xIsNext ? "text-blue-600" : "text-red-600"}>{xIsNext ? 'X' : 'O'}</span>
          </p>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>Players take turns placing X or O on the board</li>
          <li>The first player to get 3 in a row (horizontally, vertically, or diagonally) wins</li>
          <li>If all squares are filled and no player has 3 in a row, the game is a draw</li>
        </ul>
      </div>
    </div>
  );
};

// Games Tab Component - Contains both games with game selector
const GamesTabContent: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'none' | 'snake' | 'tictactoe'>('none');
  
  return (
    <div className="min-h-screen pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Fun Games</h1>
          
          {selectedGame === 'none' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Snake Game Card */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedGame('snake')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🐍</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Snake Game</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Control the snake to eat food and grow longer, but be careful not to hit the walls or yourself!
                </p>
                <button 
                  onClick={() => setSelectedGame('snake')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Play Snake
                </button>
              </div>
              
              {/* Tic Tac Toe Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedGame('tictactoe')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">#️⃣</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Tic Tac Toe</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Classic game of X's and O's. Take turns and be the first to get three in a row!
                </p>
                <button 
                  onClick={() => setSelectedGame('tictactoe')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Play Tic Tac Toe
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedGame('none')}
                className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                Back to Games
              </button>
              
              {selectedGame === 'snake' ? <SnakeGame /> : <TicTacToe />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Games: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const { user } = useAuth();
  
  // Single tab for all sections
  const [activeTab, setActiveTab] = useState<'challenges' | 'games'>('challenges');

  // Fetch all challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_ENDPOINTS.CHALLENGES.CURRENT, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data) {
            setChallenges([data]); // Start with current challenge
            
            // Also fetch all challenges
            const allResponse = await fetch(`${API_ENDPOINTS.CHALLENGES.CURRENT.split('/current')[0]}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (allResponse.ok) {
              const allData = await allResponse.json();
              // Add challenges not already included
              const additionalChallenges = allData.filter((c: Challenge) => 
                c._id !== data._id
              );
              setChallenges([data, ...additionalChallenges]);
            }
          } else {
            // No current challenge, fetch all challenges
            const allResponse = await fetch(`${API_ENDPOINTS.CHALLENGES.CURRENT.split('/current')[0]}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            
            if (allResponse.ok) {
              const allData = await allResponse.json();
              setChallenges(allData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'challenges') {
      fetchChallenges();
    }
  }, [activeTab]);

  // Join a challenge
  const handleJoinChallenge = async (challengeId: string) => {
    if (joinLoading) return;
    
    try {
      setJoinLoading(true);
      const response = await fetch(API_ENDPOINTS.CHALLENGES.JOIN(challengeId), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const updatedChallenge = await response.json();
        
        // Update challenges list with the updated challenge
        setChallenges(prev => 
          prev.map(c => c._id === updatedChallenge._id ? updatedChallenge : c)
        );
        
        // If we're viewing this challenge, update it
        if (selectedChallenge?._id === updatedChallenge._id) {
          setSelectedChallenge(updatedChallenge);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to join challenge');
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      alert('Error joining challenge. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  // Check if user has joined a challenge
  const hasJoinedChallenge = (challenge: Challenge) => {
    return challenge.participants.some(p => p.user._id === user?.id);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days remaining
  const getDaysRemaining = (endDateString: string) => {
    const endDate = new Date(endDateString);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Render tab navigation
  const renderTabNav = () => (
    <div className="flex justify-center mb-8 border-b border-gray-200">
      <button
        className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
          activeTab === 'challenges'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('challenges')}
      >
        <Trophy className="inline-block w-5 h-5 mr-2" />
        Cooking Challenges
      </button>
      <button
        className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
          activeTab === 'games'
            ? 'border-orange-500 text-orange-600'
            : 'border-transparent text-gray-500 hover:text-gray-800'
        }`}
        onClick={() => setActiveTab('games')}
      >
        <span className="inline-block mr-2">🎮</span>
        Games
      </button>
    </div>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'games':
        return <GamesTabContent />;
      case 'challenges':
      default:
        return renderChallengesContent();
    }
  };

  // Render challenges content (existing code)
  const renderChallengesContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader className="w-16 h-16 text-gray-700 animate-spin" />
        </div>
      );
    }

    if (selectedChallenge) {
      return (
        <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">{selectedChallenge.emoji}</span>
                  {selectedChallenge.title}
                </h1>
                <p className="text-gray-600 mt-1">{selectedChallenge.description}</p>
              </div>
              <button
                onClick={() => setSelectedChallenge(null)}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Back to Challenges
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold">Prize: {selectedChallenge.prize}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold">
                    {getDaysRemaining(selectedChallenge.endDate)} day{getDaysRemaining(selectedChallenge.endDate) !== 1 ? 's' : ''} left
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={joinLoading ? undefined : () => handleJoinChallenge(selectedChallenge._id)}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    joinLoading ? 'bg-gray-300 text-gray-600' : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700'
                  }`}
                  disabled={joinLoading}
                >
                  {joinLoading ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : hasJoinedChallenge(selectedChallenge) ? (
                    <Award className="w-4 h-4 mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {hasJoinedChallenge(selectedChallenge) ? 'Joined' : 'Join Challenge'}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Challenge Details</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Rules</h4>
                  <ul className="list-disc list-inside">
                    {selectedChallenge.rules.map((rule, index) => (
                      <li key={index} className="text-gray-700">{rule}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">Participants</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedChallenge.participants.map((participant) => (
                      <div key={participant.user._id} className="flex items-center">
                        <img
                          src={participant.user.profilePicture || '/default-avatar.png'}
                          alt={participant.user.fullName}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span className="text-gray-800 font-medium">{participant.user.fullName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen pb-20 md:pb-6">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          {challenges.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <Trophy className="w-16 h-16 text-orange-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Challenges</h2>
              <p className="text-gray-600 mb-6">There are no cooking challenges available right now. Check back soon!</p>
            </div>
          ) : (
            // Challenge list view
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Cooking Challenges</h1>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge) => (
                  <div 
                    key={challenge._id} 
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    <div className="h-3 bg-gradient-to-r from-orange-500 to-red-500"></div>
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xl">{challenge.emoji}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                          <p className="text-xs text-gray-500">
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{challenge.description}</p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mb-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{challenge.participantsCount} joined</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{getDaysRemaining(challenge.endDate)} days left</span>
                        </div>
                      </div>
                      
                      {hasJoinedChallenge(challenge) ? (
                        <div className="w-full bg-green-100 text-green-800 py-2 rounded-lg font-medium text-center text-sm">
                          You've Joined
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinChallenge(challenge._id);
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto p-4">
        {renderTabNav()}
        {renderTabContent()}
      </div>
    </div>
  );
};
