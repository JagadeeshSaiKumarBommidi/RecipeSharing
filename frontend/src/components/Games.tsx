import React, { useState, useEffect, useCallback } from 'react';
import { Gamepad2, Trophy, Star, Users, Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  type: 'quiz' | 'memory' | 'puzzle';
  difficulty: 'easy' | 'medium' | 'hard';
  players: number;
  duration: string;
  image: string;
}

export const Games: React.FC = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  // Snake Game State
  const [snake, setSnake] = useState([[10, 10]]);
  const [food, setFood] = useState([15, 15]);
  const [direction, setDirection] = useState([0, 1]);
  const [gameOver, setGameOver] = useState(false);

  // Tic-Tac-Toe Game State
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  const games: Game[] = [
    {
      id: 'recipe-quiz',
      title: 'Recipe Master Quiz',
      description: 'Test your culinary knowledge with this fun recipe quiz!',
      type: 'quiz',
      difficulty: 'medium',
      players: 1,
      duration: '5-10 min',
      image: '🧠'
    },
    {
      id: 'ingredient-memory',
      title: 'Ingredient Memory Game',
      description: 'Match pairs of ingredients to improve your memory!',
      type: 'memory',
      difficulty: 'easy',
      players: 1,
      duration: '3-8 min',
      image: '🧩'
    },
    {
      id: 'recipe-puzzle',
      title: 'Recipe Puzzle Challenge',
      description: 'Solve cooking puzzles and unlock new recipes!',
      type: 'puzzle',
      difficulty: 'hard',
      players: 1,
      duration: '10-15 min',
      image: '🔍'
    },
    {
      id: 'cooking-trivia',
      title: 'Cooking Trivia Night',
      description: 'Challenge friends with cooking trivia questions!',
      type: 'quiz',
      difficulty: 'medium',
      players: 4,
      duration: '15-20 min',
      image: '🎯'
    },
    {
      id: 'snake-game',
      title: 'Recipe Snake',
      description: 'Collect ingredients while avoiding obstacles in this classic snake game!',
      type: 'puzzle',
      difficulty: 'medium',
      players: 1,
      duration: '5-15 min',
      image: '🐍'
    },
    {
      id: 'tictactoe-game',
      title: 'Kitchen Tic-Tac-Toe',
      description: 'Challenge a friend to a game of tic-tac-toe with cooking themes!',
      type: 'puzzle',
      difficulty: 'easy',
      players: 2,
      duration: '2-5 min',
      image: '⭕'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const startGame = (gameId: string) => {
    setActiveGame(gameId);
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(60);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resetGame = () => {
    setActiveGame(null);
    setIsPlaying(false);
    setScore(0);
    setTimeLeft(60);
    // Reset Snake Game
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection([0, 1]);
    setGameOver(false);
    // Reset Tic-Tac-Toe
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  // Snake Game Logic
  const moveSnake = useCallback(() => {
    if (!isPlaying || gameOver || activeGame !== 'snake-game') return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = [newSnake[0][0] + direction[0], newSnake[0][1] + direction[1]];

      // Check boundaries
      if (head[0] < 0 || head[0] >= 20 || head[1] < 0 || head[1] >= 20) {
        setGameOver(true);
        setIsPlaying(false);
        return newSnake;
      }

      // Check self collision
      for (const segment of newSnake) {
        if (head[0] === segment[0] && head[1] === segment[1]) {
          setGameOver(true);
          setIsPlaying(false);
          return newSnake;
        }
      }

      newSnake.unshift(head);

      // Check food collision
      if (head[0] === food[0] && head[1] === food[1]) {
        setScore(prev => prev + 10);
        setFood([
          Math.floor(Math.random() * 20),
          Math.floor(Math.random() * 20)
        ]);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPlaying, gameOver, activeGame]);

  useEffect(() => {
    if (activeGame === 'snake-game' && isPlaying && !gameOver) {
      const gameInterval = setInterval(moveSnake, 150);
      return () => clearInterval(gameInterval);
    }
  }, [moveSnake, isPlaying, gameOver, activeGame]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (activeGame !== 'snake-game') return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        case 'ArrowDown':
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        case 'ArrowLeft':
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        case 'ArrowRight':
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, activeGame]);

  // Tic-Tac-Toe Logic
  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleTicTacToeClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? '🍕' : '🥗';
    setBoard(newBoard);
    
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setScore(prev => prev + 50);
    } else if (newBoard.every(square => square !== null)) {
      setWinner('draw');
    }
    
    setIsXNext(!isXNext);
  };

  const resetTicTacToe = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  if (activeGame) {
    const game = games.find(g => g.id === activeGame);
    return (
      <div className="max-w-4xl mx-auto p-4 pb-20 md:pb-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-3">{game?.image}</span>
                {game?.title}
              </h1>
              <p className="text-gray-600 mt-1">{game?.description}</p>
            </div>
            <button
              onClick={resetGame}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Back to Games
            </button>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="font-semibold">Score: {score}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold">Time: {timeLeft}s</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={isPlaying ? pauseGame : () => setIsPlaying(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all"
              >
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Resume'}
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            {activeGame === 'snake-game' ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recipe Snake Game</h3>
                {gameOver && (
                  <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
                    <p className="font-semibold">Game Over! Final Score: {score}</p>
                    <button
                      onClick={() => {
                        setSnake([[10, 10]]);
                        setFood([15, 15]);
                        setDirection([0, 1]);
                        setGameOver(false);
                        setScore(0);
                        setIsPlaying(true);
                      }}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                )}
                <div 
                  className="inline-block bg-green-100 border-2 border-green-300 rounded-lg"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(20, 20px)',
                    gridTemplateRows: 'repeat(20, 20px)',
                    gap: '1px'
                  }}
                >
                  {Array.from({ length: 400 }).map((_, index) => {
                    const row = Math.floor(index / 20);
                    const col = index % 20;
                    const isSnake = snake.some(segment => segment[0] === row && segment[1] === col);
                    const isFood = food[0] === row && food[1] === col;
                    const isHead = snake[0] && snake[0][0] === row && snake[0][1] === col;
                    
                    return (
                      <div
                        key={index}
                        className={`w-5 h-5 ${
                          isSnake ? (isHead ? 'bg-green-800' : 'bg-green-600') : 
                          isFood ? 'bg-red-500' : 'bg-green-50'
                        }`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                      >
                        {isFood && '🍎'}
                        {isSnake && isHead && '🐍'}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Use arrow keys to control the snake</p>
                  <p>Collect apples to grow and increase your score!</p>
                </div>
              </div>
            ) : activeGame === 'tictactoe-game' ? (
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Kitchen Tic-Tac-Toe</h3>
                {winner && (
                  <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg">
                    <p className="font-semibold">
                      {winner === 'draw' ? "It's a draw!" : `${winner} wins!`}
                    </p>
                    <button
                      onClick={resetTicTacToe}
                      className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                )}
                <div className="inline-block">
                  <div className="grid grid-cols-3 gap-2 bg-gray-200 p-4 rounded-lg">
                    {board.map((square, index) => (
                      <button
                        key={index}
                        onClick={() => handleTicTacToeClick(index)}
                        className="w-16 h-16 bg-white rounded-lg text-2xl font-bold hover:bg-gray-50 transition-colors border-2 border-gray-300"
                        disabled={!!square || !!winner}
                      >
                        {square}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Current player: {isXNext ? '🍕 Pizza' : '🥗 Salad'}</p>
                  <p>Get three in a row to win!</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Game Interface</h3>
                <p className="text-gray-600 mb-6">This is where the actual game would be implemented!</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    Option A
                  </button>
                  <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    Option B
                  </button>
                  <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    Option C
                  </button>
                  <button className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    Option D
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 pb-20 md:pb-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
          <Gamepad2 className="w-8 h-8 mr-3 text-orange-600" />
          Recipe Games
        </h1>
        <p className="text-gray-600">Challenge yourself with fun cooking games and improve your culinary skills!</p>
      </div>

      {/* Featured Game */}
      <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-4xl mr-4">🏆</span>
              <div>
                <h2 className="text-2xl font-bold">Game of the Week</h2>
                <p className="opacity-90">Recipe Master Quiz Challenge</p>
              </div>
            </div>
            <p className="opacity-80 mb-6 max-w-md">
              Test your knowledge with our most popular recipe quiz! Compete with other food enthusiasts and climb the leaderboard.
            </p>
            <button
              onClick={() => startGame('recipe-quiz')}
              className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Play Now
            </button>
          </div>
          <div className="hidden md:block text-8xl opacity-20">🎮</div>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{game.image}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(game.difficulty)}`}>
                  {game.difficulty.toUpperCase()}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 mb-4 text-sm">{game.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {game.players} {game.players === 1 ? 'Player' : 'Players'}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {game.duration}
                </div>
              </div>
              
              <button
                onClick={() => startGame(game.id)}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all"
              >
                Start Game
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
          Weekly Leaderboard
        </h2>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'ChefMaster2024', score: 2450, avatar: '👨‍🍳' },
            { rank: 2, name: 'RecipeQueen', score: 2380, avatar: '👩‍🍳' },
            { rank: 3, name: 'CookingPro', score: 2250, avatar: '🧑‍🍳' },
            { rank: 4, name: 'FoodieFan', score: 2100, avatar: '🍕' },
            { rank: 5, name: 'KitchenWiz', score: 1980, avatar: '🥘' }
          ].map((player) => (
            <div key={player.rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  player.rank === 1 ? 'bg-yellow-500' : 
                  player.rank === 2 ? 'bg-gray-400' : 
                  player.rank === 3 ? 'bg-orange-600' : 'bg-gray-300'
                }`}>
                  {player.rank}
                </div>
                <span className="text-2xl">{player.avatar}</span>
                <span className="font-semibold text-gray-900">{player.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-bold text-gray-900">{player.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
