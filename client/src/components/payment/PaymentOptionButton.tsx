import React from 'react';
import { SiWechat, SiAlipay } from 'react-icons/si';
import { FaCreditCard, FaBitcoin, FaGooglePay, FaApple } from 'react-icons/fa';

const PaymentOptionButton = ({ option, isSelected, onClick }) => {
  const icons = {
    wechat_pay: SiWechat,
    alipay: SiAlipay,
    card: FaCreditCard,
    bitcoin: FaBitcoin,
    google_pay: FaGooglePay,
    apple_pay: FaApple,
  };

  const Icon = icons[option];

  const handleClick = () => {
    console.log('PaymentOptionButton clicked:', option);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`mb-2 rounded border-2 p-2 transition-colors duration-200 ease-in-out ${
        isSelected
          ? 'border-blue-600 bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-blue-100 active:bg-blue-200'
      }`}
    >
      <Icon size="2.5em" />
    </button>
  );
};

export default PaymentOptionButton;
