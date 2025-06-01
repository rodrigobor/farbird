import React, { useState, useEffect, useRef } from 'react';
import '../styles/Game.css';

// Constantes do jogo
const GRAVITY = 0.5;
const JUMP_FORCE = -10;
const PIPE_WIDTH = 80;
const PIPE_GAP = 200;
const PIPE_SPEED = 3;
const BIRD_SIZE = 30;
const GAME_HEIGHT = 500;
const GAME_WIDTH = 360;

interface GameProps {
  onGameOver: (score: number) => void;
  isPaymentComplete: boolean;
}

const Game: React.FC<GameProps> = ({ onGameOver, isPaymentComplete }) => {
  const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Iniciar o jogo
  const startGame = () => {
    if (!isPaymentComplete) {
      alert('Please pay to play!');
      return;
    }
    
    if (!gameOver) {
      setGameStarted(true);
      setBirdVelocity(0);
      setPipes([]);
      setScore(0);
    }
  };

  // Reiniciar o jogo
  const resetGame = () => {
    setGameOver(false);
    setBirdPosition(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
  };

  // Fazer o pássaro pular
  const jump = () => {
    if (!gameStarted) {
      startGame();
      return;
    }
    
    if (!gameOver) {
      setBirdVelocity(JUMP_FORCE);
    }
  };

  // Efeito para a física do jogo
  useEffect(() => {
    let gameLoop: number;
    
    if (gameStarted && !gameOver) {
      gameLoop = window.setInterval(() => {
        // Atualizar posição do pássaro
        setBirdPosition((prevPosition) => {
          const newPosition = prevPosition + birdVelocity;
          
          // Verificar colisão com o topo ou o chão
          if (newPosition <= 0 || newPosition >= GAME_HEIGHT - BIRD_SIZE) {
            setGameOver(true);
            onGameOver(score);
            return prevPosition;
          }
          
          return newPosition;
        });
        
        // Atualizar velocidade do pássaro (gravidade)
        setBirdVelocity((prevVelocity) => prevVelocity + GRAVITY);
        
        // Mover canos
        setPipes((prevPipes) => {
          // Filtrar canos que saíram da tela
          const filteredPipes = prevPipes
            .map((pipe) => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
            .filter((pipe) => pipe.x > -PIPE_WIDTH);
          
          // Adicionar pontuação quando o pássaro passa por um cano
          const passedPipe = prevPipes.find(
            (pipe) => pipe.x + PIPE_WIDTH < GAME_WIDTH / 2 - BIRD_SIZE / 2 && 
                     pipe.x + PIPE_WIDTH + PIPE_SPEED >= GAME_WIDTH / 2 - BIRD_SIZE / 2
          );
          
          if (passedPipe) {
            setScore((prevScore) => prevScore + 1);
          }
          
          // Verificar colisões com os canos
          const collidedWithPipe = prevPipes.some((pipe) => {
            const birdRight = GAME_WIDTH / 2 + BIRD_SIZE / 2;
            const birdLeft = GAME_WIDTH / 2 - BIRD_SIZE / 2;
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;
            
            // Verificar se o pássaro está na mesma posição horizontal que o cano
            if (birdRight > pipeLeft && birdLeft < pipeRight) {
              const birdTop = birdPosition;
              const birdBottom = birdPosition + BIRD_SIZE;
              
              // Verificar se o pássaro está colidindo com o cano superior ou inferior
              return (
                birdTop < pipe.topHeight || 
                birdBottom > pipe.topHeight + PIPE_GAP
              );
            }
            
            return false;
          });
          
          if (collidedWithPipe) {
            setGameOver(true);
            onGameOver(score);
          }
          
          return filteredPipes;
        });
        
        // Adicionar novos canos
        setPipes((prevPipes) => {
          const lastPipe = prevPipes[prevPipes.length - 1];
          
          if (!lastPipe || lastPipe.x < GAME_WIDTH - 200) {
            const topHeight = Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 100)) + 50;
            return [...prevPipes, { x: GAME_WIDTH, topHeight }];
          }
          
          return prevPipes;
        });
      }, 20);
    }
    
    return () => {
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [gameStarted, gameOver, birdPosition, birdVelocity, score, onGameOver, isPaymentComplete]);

  return (
    <div 
      className="game-container" 
      onClick={jump}
      ref={gameAreaRef}
      style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
    >
      {/* Pássaro */}
      <div 
        className="bird"
        style={{
          top: birdPosition,
          left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
          width: BIRD_SIZE,
          height: BIRD_SIZE,
          transform: `rotate(${birdVelocity * 2}deg)`
        }}
      />
      
      {/* Canos */}
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          {/* Cano superior */}
          <div
            className="pipe top-pipe"
            style={{
              left: pipe.x,
              height: pipe.topHeight,
              width: PIPE_WIDTH
            }}
          />
          
          {/* Cano inferior */}
          <div
            className="pipe bottom-pipe"
            style={{
              left: pipe.x,
              top: pipe.topHeight + PIPE_GAP,
              height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
              width: PIPE_WIDTH
            }}
          />
        </React.Fragment>
      ))}
      
      {/* Pontuação */}
      <div className="score">{score}</div>
      
      {/* Tela inicial */}
      {!gameStarted && !gameOver && (
        <div className="start-screen">
          <h2>Far Bird</h2>
          <p>Tap to start</p>
          {!isPaymentComplete && (
            <p className="payment-warning">Payment required to play!</p>
          )}
        </div>
      )}
      
      {/* Tela de game over */}
      {gameOver && (
        <div className="game-over-screen">
          <h2>Game Over</h2>
          <p>Score: {score}</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;
