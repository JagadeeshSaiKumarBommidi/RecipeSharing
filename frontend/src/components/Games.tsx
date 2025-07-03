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

// WordChef Game Component
const WordChefGame: React.FC = () => {
  const [letters, setLetters] = useState<string[]>([]);
  const [userWords, setUserWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(60);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [validWords, setValidWords] = useState<string[]>([]);
  
  // Food-themed word sets
  const wordSets = [
    {
      letters: ['S', 'A', 'U', 'C', 'E', 'P', 'A', 'N'],
      validWords: ['sauce', 'pan', 'spa', 'can', 'ace', 'pace', 'sap', 'cane', 'cape', 'nap', 'nape', 'pace']
    },
    {
      letters: ['B', 'A', 'K', 'I', 'N', 'G'],
      validWords: ['baking', 'king', 'baking', 'akin', 'gain', 'kin', 'bag', 'ban', 'bin', 'ink', 'nab']
    },
    {
      letters: ['C', 'H', 'O', 'P', 'P', 'E', 'D'],
      validWords: ['chopped', 'hope', 'chop', 'cope', 'hop', 'pep', 'pod', 'code', 'doe', 'echo', 'pep']
    },
    {
      letters: ['R', 'E', 'C', 'I', 'P', 'E'],
      validWords: ['recipe', 'rice', 'pier', 'ripe', 'pipe', 'peer', 'pee', 'ice', 'pie', 'rip']
    },
    {
      letters: ['S', 'P', 'I', 'C', 'E', 'S'],
      validWords: ['spices', 'pies', 'sips', 'piece', 'spice', 'cis', 'spec', 'sip', 'pie', 'ice']
    }
  ];
  
  // Start a new game
  const startGame = () => {
    const randomSet = wordSets[Math.floor(Math.random() * wordSets.length)];
    setLetters([...randomSet.letters].sort(() => Math.random() - 0.5));
    setValidWords(randomSet.validWords);
    setUserWords([]);
    setCurrentWord('');
    setScore(0);
    setTimer(60);
    setGameActive(true);
    setGameOver(false);
  };
  
  // Handle letter click
  const handleLetterClick = (letter: string, index: number) => {
    setCurrentWord(prev => prev + letter);
    
    // Temporarily remove the letter from the available letters
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);
  };
  
  // Submit current word
  const submitWord = () => {
    if (currentWord.length < 3) {
      alert('Words must be at least 3 letters long');
      resetCurrentWord();
      return;
    }
    
    const wordLower = currentWord.toLowerCase();
    
    if (userWords.includes(wordLower)) {
      alert('You already found this word');
      resetCurrentWord();
      return;
    }
    
    if (validWords.includes(wordLower)) {
      // Word is valid
      setUserWords(prev => [...prev, wordLower]);
      setScore(prev => prev + (currentWord.length * 10));
      resetCurrentWord();
    } else {
      alert('Not a valid word');
      resetCurrentWord();
    }
  };
  
  // Reset current word and restore letters
  const resetCurrentWord = () => {
    setCurrentWord('');
    setLetters(prevLetters => {
      const randomSet = wordSets.find(set => 
        set.validWords.includes(validWords[0])
      );
      return randomSet ? [...randomSet.letters].sort(() => Math.random() - 0.5) : prevLetters;
    });
  };
  
  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setGameActive(false);
      setGameOver(true);
    }
    
    return () => clearInterval(interval);
  }, [gameActive, timer]);
  
  return (
    <div className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4">Word Chef</h2>
      
      {!gameActive && !gameOver ? (
        <div className="text-center">
          <p className="text-gray-700 mb-6">Create food-related words from the given letters. Each word must be at least 3 letters long.</p>
          <button 
            onClick={startGame}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          {gameActive && (
            <div className="w-full max-w-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="text-lg font-semibold">Score: {score}</div>
                <div className="text-lg font-semibold">Time: {timer}s</div>
              </div>
              
              <div className="bg-amber-50 p-6 rounded-lg mb-6 text-center">
                <div className="text-2xl font-bold mb-4">{currentWord || 'Click letters below'}</div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {letters.map((letter, index) => (
                    <button
                      key={index}
                      onClick={() => handleLetterClick(letter, index)}
                      className="w-12 h-12 bg-amber-400 text-white rounded-md text-xl font-bold hover:bg-amber-500 transition-colors"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={submitWord}
                    disabled={currentWord.length < 3}
                    className={`flex-1 py-2 rounded-md ${
                      currentWord.length < 3 
                        ? 'bg-gray-300 text-gray-500' 
                        : 'bg-green-500 hover:bg-green-600 text-white'
                    }`}
                  >
                    Submit
                  </button>
                  <button
                    onClick={resetCurrentWord}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold mb-2">Words Found ({userWords.length}):</h3>
                <div className="flex flex-wrap gap-2">
                  {userWords.map((word, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {word}
                    </span>
                  ))}
                  {userWords.length === 0 && (
                    <span className="text-gray-500 italic">No words found yet</span>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {gameOver && (
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Game Over!</h3>
              <p className="text-lg mb-2">Your score: {score}</p>
              <p className="text-gray-700 mb-6">You found {userWords.length} words</p>
              
              <div className="mb-8">
                <h4 className="font-bold mb-2">Words you found:</h4>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {userWords.map((word, index) => (
                    <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">
                      {word}
                    </span>
                  ))}
                </div>
                
                <h4 className="font-bold mb-2">All possible words:</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {validWords.map((word, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm ${
                        userWords.includes(word)
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={startGame}
                className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>Click on letters to form words (minimum 3 letters)</li>
          <li>Words must be related to cooking, food, or kitchen terms</li>
          <li>Submit as many valid words as you can before time runs out</li>
          <li>Longer words earn more points</li>
        </ul>
      </div>
    </div>
  );
};

// Ingredient Match Game Component
const IngredientMatchGame: React.FC = () => {
  const [cards, setCards] = useState<Array<{id: number, ingredient: string, flipped: boolean, matched: boolean}>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [timer, setTimer] = useState(0);
  
  // Ingredient pairs
  const ingredients = [
    '🍅', '🥕', '🥦', '🍆', '🌽', '🥔', '🥑', '🍎', 
    '🧄', '🧅', '🌶️', '🥬'
  ];
  
  // Initialize game
  const startGame = () => {
    // Create pairs of ingredients
    const cardPairs = [...ingredients.slice(0, 8)].flatMap(ingredient => [
      { id: Math.random(), ingredient, flipped: false, matched: false },
      { id: Math.random(), ingredient, flipped: false, matched: false }
    ]);
    
    // Shuffle cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setGameOver(false);
    setGameStarted(true);
    setMatchedPairs(0);
    setTimer(0);
  };
  
  // Handle card click
  const handleCardClick = (index: number) => {
    // Ignore click if card is already flipped or matched
    if (cards[index].flipped || cards[index].matched) return;
    
    // Ignore if already two cards flipped
    if (flippedCards.length === 2) return;
    
    // Flip card
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);
    
    // Check for match if two cards flipped
    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedCards;
      const firstCard = newCards[firstIndex];
      const secondCard = newCards[secondIndex];
      
      if (firstCard.ingredient === secondCard.ingredient) {
        // Match found
        newCards[firstIndex].matched = true;
        newCards[secondIndex].matched = true;
        setCards(newCards);
        setFlippedCards([]);
        setMatchedPairs(prev => {
          const newMatchedPairs = prev + 1;
          // Check for game over
          if (newMatchedPairs === 8) {
            setGameOver(true);
          }
          return newMatchedPairs;
        });
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          newCards[firstIndex].flipped = false;
          newCards[secondIndex].flipped = false;
          setCards(newCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);
  
  return (
    <div className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4">Ingredient Match</h2>
      
      {!gameStarted ? (
        <div className="text-center mb-8">
          <p className="text-gray-700 mb-6">
            Test your memory by matching pairs of ingredients. Find all pairs with the fewest moves possible!
          </p>
          <button 
            onClick={startGame}
            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-lg">
            <div className="flex justify-between mb-4">
              <div className="text-lg font-semibold">
                Moves: {moves}
              </div>
              <div className="text-lg font-semibold">
                Time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-lg font-semibold">
                Pairs: {matchedPairs}/8
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-3 mx-auto">
              {cards.map((card, index) => (
                <div 
                  key={card.id} 
                  onClick={() => handleCardClick(index)}
                  className={`
                    aspect-square flex items-center justify-center 
                    text-3xl rounded-lg shadow-sm cursor-pointer transition-all
                    ${card.flipped || card.matched ? 'bg-white' : 'bg-pink-100'} 
                    ${card.matched ? 'bg-green-100' : ''}
                    ${!card.flipped && !card.matched ? 'hover:bg-pink-200' : ''}
                  `}
                >
                  {(card.flipped || card.matched) ? card.ingredient : ''}
                </div>
              ))}
            </div>
          </div>
          
          {gameOver && (
            <div className="text-center mt-8">
              <h3 className="text-xl font-bold mb-2">Congratulations! 🎉</h3>
              <p className="text-lg mb-4">
                You completed the game in {moves} moves and {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')} time!
              </p>
              <button 
                onClick={startGame}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-medium"
              >
                Play Again
              </button>
            </div>
          )}
        </>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>Click on cards to flip them and reveal ingredients</li>
          <li>Try to find matching pairs of ingredients</li>
          <li>Match all pairs to win the game</li>
          <li>Challenge yourself to finish with fewer moves and less time</li>
        </ul>
      </div>
    </div>
  );
};

// Food Trivia Game Component
const FoodTriviaGame: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Food trivia questions
  const questions = [
    {
      question: "Which fruit is known as the 'king of fruits'?",
      options: ["Durian", "Mango", "Jackfruit", "Dragon Fruit"],
      answer: "Durian"
    },
    {
      question: "What is the main ingredient in traditional guacamole?",
      options: ["Tomato", "Avocado", "Onion", "Lime"],
      answer: "Avocado"
    },
    {
      question: "Which spice is the world's most expensive by weight?",
      options: ["Vanilla", "Cardamom", "Saffron", "Truffle"],
      answer: "Saffron"
    },
    {
      question: "What food is traditionally eaten on Shrove Tuesday?",
      options: ["Donuts", "Pancakes", "Waffles", "Crepes"],
      answer: "Pancakes"
    },
    {
      question: "Which Italian cheese is traditionally used in a classic Tiramisu?",
      options: ["Ricotta", "Mascarpone", "Mozzarella", "Parmesan"],
      answer: "Mascarpone"
    },
    {
      question: "Which popular vegetable is actually a fruit?",
      options: ["Carrot", "Potato", "Tomato", "Broccoli"],
      answer: "Tomato"
    },
    {
      question: "What is the main ingredient in hummus?",
      options: ["Lentils", "Chickpeas", "Black Beans", "Split Peas"],
      answer: "Chickpeas"
    },
    {
      question: "Which nut is used to make marzipan?",
      options: ["Walnut", "Almond", "Pistachio", "Hazelnut"],
      answer: "Almond"
    },
    {
      question: "What is the process of slowly cooking food in fat called?",
      options: ["Blanching", "Braising", "Confit", "Poaching"],
      answer: "Confit"
    },
    {
      question: "What is Japan's traditional alcoholic beverage made from fermented rice?",
      options: ["Shochu", "Umeshu", "Sake", "Mirin"],
      answer: "Sake"
    }
  ];
  
  // Start game
  const startGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setGameStarted(true);
    setSelectedAnswer(null);
    setAnswerResult(null);
  };
  
  // Handle answer
  const handleAnswerClick = (selectedOption: string) => {
    if (answerResult) return; // Prevent multiple answers
    
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    setSelectedAnswer(selectedOption);
    setAnswerResult(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setAnswerResult(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };
  
  // Restart game
  const restartGame = () => {
    startGame();
  };
  
  return (
    <div className="flex flex-col items-center my-8">
      <h2 className="text-2xl font-bold mb-4">Food Trivia</h2>
      
      {!gameStarted ? (
        <div className="text-center mb-8">
          <p className="text-gray-700 mb-6">
            Test your culinary knowledge with this food trivia quiz! Answer questions about ingredients, cooking techniques, and food facts.
          </p>
          <button 
            onClick={startGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            Start Quiz
          </button>
        </div>
      ) : showScore ? (
        <div className="text-center w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Quiz Complete!</h3>
          <div className="bg-purple-100 rounded-xl p-8 mb-6">
            <p className="text-4xl font-bold text-purple-800 mb-2">{score} / {questions.length}</p>
            <p className="text-gray-700">
              {score >= 8 ? 'Amazing! You\'re a food expert! 👨‍🍳' : 
               score >= 5 ? 'Great job! You know your food! 🍽️' : 
               'Keep learning about food! 🥄'}
            </p>
          </div>
          <button 
            onClick={restartGame}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium"
          >
            Play Again
          </button>
        </div>
      ) : (
        <div className="w-full max-w-lg">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-lg font-semibold">
              Score: {score}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-xl font-bold mb-6">
              {questions[currentQuestion].question}
            </h3>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(option)}
                  disabled={answerResult !== null}
                  className={`
                    w-full text-left p-4 rounded-lg transition-colors
                    ${selectedAnswer === option && answerResult === 'correct' ? 'bg-green-100 border-2 border-green-500' : 
                      selectedAnswer === option && answerResult === 'incorrect' ? 'bg-red-100 border-2 border-red-500' : 
                      option === questions[currentQuestion].answer && answerResult === 'incorrect' ? 'bg-green-100 border-2 border-green-500' :
                      'bg-gray-100 hover:bg-gray-200'}
                  `}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {answerResult && (
            <div className={`p-4 rounded-lg mb-6 text-center ${
              answerResult === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-semibold">
                {answerResult === 'correct' ? 'Correct! Well done! ✅' : 'Incorrect! The correct answer is ' + questions[currentQuestion].answer + ' ❌'}
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc pl-5">
          <li>Read each question carefully</li>
          <li>Select the answer you think is correct</li>
          <li>See your results immediately</li>
          <li>Try to answer all 10 questions correctly</li>
        </ul>
      </div>
    </div>
  );
};

// Games Tab Component - Contains both games with game selector
const GamesTabContent: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<'none' | 'snake' | 'tictactoe' | 'wordchef' | 'ingredientmatch' | 'foodtrivia'>('none');
  
  return (
    <div className="min-h-screen pb-20 md:pb-6">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Fun Games</h1>
          
          {selectedGame === 'none' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              
              {/* Word Chef Card */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedGame('wordchef')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🍳</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Word Chef</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Create words from a set of letters related to cooking and food. How many can you find?
                </p>
                <button 
                  onClick={() => setSelectedGame('wordchef')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Play Word Chef
                </button>
              </div>
              
              {/* Ingredient Match Card */}
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedGame('ingredientmatch')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🥕</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Ingredient Match</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Find matching pairs of ingredients in this memory card game. Test your memory skills!
                </p>
                <button 
                  onClick={() => setSelectedGame('ingredientmatch')}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Play Ingredient Match
                </button>
              </div>
              
              {/* Food Trivia Card */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={() => setSelectedGame('foodtrivia')}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Food Trivia</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  Test your culinary knowledge with questions about food, cooking techniques, and cuisines!
                </p>
                <button 
                  onClick={() => setSelectedGame('foodtrivia')}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Play Food Trivia
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
              
              {selectedGame === 'snake' && <SnakeGame />}
              {selectedGame === 'tictactoe' && <TicTacToe />}
              {selectedGame === 'wordchef' && <WordChefGame />}
              {selectedGame === 'ingredientmatch' && <IngredientMatchGame />}
              {selectedGame === 'foodtrivia' && <FoodTriviaGame />}
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

                {/* Placeholder for empty space in grid */}
                {challenges.length % 3 === 1 && (
                  <div className="w-full h-20 md:hidden"></div>
                )}
                {challenges.length % 3 === 2 && (
                  <div className="w-full h-20 hidden md:block"></div>
                )}
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
