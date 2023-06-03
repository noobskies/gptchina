import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./PaymentForm.css";
import { useAuthContext } from '../../hooks/AuthContext.tsx';
import axios from 'axios';

const PaymentForm = ({ handlePaymentSuccess }) => {
  const { user } = useAuthContext();
  const userId = user?.id;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.error("[error]", error);
    } else {
      try {
        const response = await axios.post("/api/free-messages/increment-free-messages", { userId });
        handlePaymentSuccess(paymentMethod.id, response.data.updatedFreeMessages);
      } catch (updateError) {
        console.error("Failed to update free messages:", updateError);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default PaymentForm;
