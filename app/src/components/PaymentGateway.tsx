import React, { useState } from 'react';
import  sdk  from '@farcaster/frame-sdk';
import '../styles/PaymentGateway.css';

interface PaymentGatewayProps {
  onPaymentComplete: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onPaymentComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // USDC na rede BASE
  const USDC_TOKEN = "eip155:8453/erc20:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
  // Endereço de recebimento
  const RECIPIENT_ADDRESS = "0xC6E5e68492fb7D73955c4F80168552C638844409";
  // Valor de 0.10 USDC (considerando 6 casas decimais)
  const AMOUNT = "100000";

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Verificar se o SDK está disponível
      if (!sdk || !sdk.actions || !sdk.actions.sendToken) {
        throw new Error("Farcaster SDK is not available");
      }

      // Iniciar o pagamento usando o SDK do Farcaster
      const result = await sdk.actions.sendToken({
        token: USDC_TOKEN,
        amount: AMOUNT,
        recipientAddress: RECIPIENT_ADDRESS
      });

      if (result.success) {
        console.log("Payment made successfully:", result.send.transaction);
        onPaymentComplete();
      } else {
        console.error("Payment error:", result.reason, result.error);
        setError(`Payment failed: ${result.reason}`);
      }
    } catch (err) {
      console.error("Error processing payment:", err);
      setError(`Error processing payment: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Pay to Play</h2>
      <p>To play a match, you need to pay 0.10 USDC</p>
      
      <div className="payment-details">
        <div className="detail-row">
          <span>Value:</span>
          <span>0,10 USDC</span>
        </div>
        <div className="detail-row">
          <span>Chain:</span>
          <span>BASE</span>
        </div>
      </div>

      <button 
        className="payment-button" 
        onClick={handlePayment} 
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Pay 0,10 USDC'}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PaymentGateway;
