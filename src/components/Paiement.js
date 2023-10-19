import { Button, IconButton, Typography } from "@mui/material";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import '../style/PremiumButton.css'
import CloseIcon from '@mui/icons-material/Close';

export default function Paiement({ setModalOpen }) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(stripe, elements)

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    const {error} = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000',
      }
    });

    if (error) {
      setMessage(error.message);
    } else {
      setModalOpen(false)
    }

    setIsProcessing(false);
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit} style={{ background: 'white', maxWidth: '100%', padding: '20px', borderRadius: '5px' }}>
      <div style={{ width: '100%', height: '0', textAlign: 'end' }}>
        <IconButton onClick={() => setModalOpen(false)}>
          <CloseIcon />
        </IconButton>
      </div>
      <Typography variant="h5" style={{ marginBottom: '1.5rem' }}>Paiement</Typography>
      <PaymentElement />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button type="submit" disabled={isProcessing} className="button" size="small"  >
          <span id="button-text">
            {isProcessing ? "En cours..." : "Payer Maintenant"}
          </span>
        </Button>
      </div>

      {message && <div>{message}</div>}
    </form>
  )
}
