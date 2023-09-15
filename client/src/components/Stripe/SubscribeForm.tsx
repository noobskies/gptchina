import React, { useState } from "react";
import axios from 'axios';
import { useAuthContext } from '~/hooks/AuthContext';
import { Spinner } from '~/components';

const priceOptions = [
  { id: 'pro_day', price: 'price_1NVfNRHKD0byXXClLn0jZo3k', label: '24hr Pro', method: 'wechat_pay', priceValue: '¥25 CNY', duration: 'Day', features: ['GPT-4 Access (25 messages per day)', 'GPT-3.5 (100 messages per day)'] },
  { id: 'pro_week', price: 'price_1NVfNlHKD0byXXClcCS7GGUy', label: '1 Week Pro', method: 'wechat_pay', priceValue: '¥100 CNY', duration: 'Week', features: ['GPT-4 Access (25 messages per day)', 'GPT-3.5 (100 messages per day)'] },
  { id: 'pro_month', price: 'price_1NVfO3HKD0byXXCld3XFHMOj', label: '1 Month Pro', method: 'wechat_pay', priceValue: '¥200 CNY', duration: 'Month', features: ['GPT-4 Access (25 messages per day)', 'GPT-3.5 (100 messages per day)'] },
  { id: 'pro_year', price: 'price_1NVfOMHKD0byXXCllGN0MBlN', label: '1 Year Pro', method: 'wechat_pay', priceValue: '¥1,500 CNY', duration: 'Year', features: ['GPT-4 Access (25 messages per day)', 'GPT-3.5 (100 messages per day)'] },
  { id: 'pro_month_card', price: 'price_1NHVPpHKD0byXXClYlrta1Qu', label: 'Monthly', method: 'card', priceValue: '$19.99 USD', duration: 'Month', features: ['GPT-4 Access (25 messages per day)', 'GPT-3.5 (100 messages per day)'] },
];

const SubscribeForm = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButtonId, setLoadingButtonId] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('wechat_pay');
  const [hoveredCard, setHoveredCard] = useState(null);

  const onSubmit = async (option) => {
    setIsLoading(true);
    setLoadingButtonId(option.id);

    try {
      const customerResponse = await axios.post("/api/stripe/create-customer", {
        name: user.name,
        email: user.email,
        id: user.id
      });

      const customerId = customerResponse.data.id;
      const priceId = option.price;
      
      console.log(`Creating checkout session with priceId: ${priceId}, customerId: ${customerId}, userId: ${user.id}, paymentMethod: ${option.method}`);
      
      const sessionResponse = await axios.post("/api/stripe/create-checkout-session", {
        priceId,
        customerId,
        userId: user.id,
        paymentMethod: option.method
      });

      window.location.href = sessionResponse.data.url;
    } catch (error) {
      console.error("Error:", error);
      setError(`Error: ${error.message}`);
    }

    setIsLoading(false);
    setLoadingButtonId(null);
  };

  return (
    <section className="py-6 dark:bg-gray-800 dark:text-gray-100">
      <div className="container mx-auto">
        <div className="mb-12 space-y-4 text-center">
          <p className="px-4 sm:px-8 lg:px-24">
            Dear Users, To serve you better, we're shifting to a token-based payment system. 
            As we transition, "Baopals Pro" will be temporarily unavailable. 
            This change aims to offer more transparent and flexible billing based on your actual usage.
            <br/><br/>
            Thank you for your patience and understanding during this update.
            <br/><br/>
            Warm regards,
            <br/>
            The gptchina.io Team
          </p>
          <div>
            <button 
              onClick={() => setSelectedPaymentMethod('wechat_pay')}
              className={`w-1/3 px-4 py-1 border rounded-l-lg bg-gray-200 text-gray-600`}
              disabled
            >
              WeChat
            </button>
            <button 
              onClick={() => setSelectedPaymentMethod('card')}
              className={`w-1/3 px-4 py-1 border rounded-r-lg bg-gray-200 text-gray-600`}
              disabled
            >
              Visa/Mastercard
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center w-full">
          {priceOptions.filter(option => option.method === selectedPaymentMethod).map(option => (
            <div 
              key={option.id} 
              className={`m-4 ${option.id === 'pro_month_card' ? 'w-1/3' : 'w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/5'} flex flex-col items-center border border-gray-200 rounded-lg p-3 shadow-lg`}
            >
              <div className="flex flex-col items-center justify-center px-2 py-8 space-y-4 dark:bg-gray-800">
                <p className="text-lg font-medium">{option.label}</p>
                <p className="text-2xl font-bold">{option.priceValue}</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2 dark:bg-gray-900">
                <ul className="self-stretch flex-1 space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full px-8 py-3 mt-4 text-lg font-semibold rounded sm:mt-4 bg-gray-300 text-gray-600"
                  disabled
                >
                  Select
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SubscribeForm;