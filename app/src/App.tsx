import React, { useState, useEffect } from 'react';
import  sdk  from '@farcaster/frame-sdk';
import Game from './components/Game';
import PaymentGateway from './components/PaymentGateway';
import './App.css';

function App() {
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Inicializar o SDK do Farcaster
  useEffect(() => {
  const initializeSDK = async () => {
    try {
      await Promise.race([
        sdk.actions.ready(),
        new Promise((resolve) => setTimeout(resolve, 2000)) // fallback de 2s
      ]);
      setIsSDKReady(true);

      // Solicitar ao usuário que adicione o Mini App aos favoritos
      const result = await sdk.actions.addMiniApp();
      if (result?.notificationDetails) {
        console.log('Mini App added to favorites!');
        console.log('Notification details:', result.notificationDetails);
      } else {
        console.warn('User declined or canceled adding to favorites');
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
    } finally {
      setShowSplash(false); // sempre remove splash
    }
  };

  initializeSDK();
}, []);



  // Função chamada quando o pagamento é concluído
  const handlePaymentComplete = () => {
    setIsPaymentComplete(true);
  };

  // Função chamada quando o jogo termina
  const handleGameOver = (score: number) => {
    console.log(`Game over! Score: ${score}`);
    // Resetar o estado de pagamento para exigir novo pagamento
    setIsPaymentComplete(false);
  };

  const handleAddToFavorites = async () => {
  try {
    const result = await sdk.actions.addMiniApp();

    if (result?.notificationDetails) {
      const { notificationDetails } = result;
      console.log('Mini App added to favorites!');
      console.log('Notification details:', notificationDetails);
    } else {
      console.warn('User declined or canceled adding to favorites');
    }

  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

  return (
    <div className="App">
      {showSplash ? (
        <div className="splash-screen">
          <div className="splash-content">
            <h1>Far Bird</h1>
            <p>Mini App for Farcaster</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      ) : (
        <>
          <header className="App-header">
            <h1>Far Bird</h1>
            <p>Pay 0.10 USDC to play</p>
          </header>
          
          <main>
            {!isPaymentComplete ? (
              <PaymentGateway onPaymentComplete={handlePaymentComplete} />
            ) : (
              <Game onGameOver={handleGameOver} isPaymentComplete={isPaymentComplete} />
            )}
          </main>
          
          <footer>
          <p>Developed by RodrigoPorsh</p>
          <button onClick={handleAddToFavorites} className="favorite-button">
            ⭐ Add to Favorites
          </button>
        </footer>

        </>
      )}
    </div>
  );
}

export default App;
