import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaRegThumbsUp, FaSpinner } from 'react-icons/fa';
import { useLocalize } from '~/hooks';
import { useAuthContext } from '~/hooks/AuthContext';

const ClaimTokensButton = ({ refetchBalance }) => {
  const localize = useLocalize();
  const { isAuthenticated, token, logout } = useAuthContext();
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLastTokenClaimTimestamp = useCallback(async () => {
    if (!isAuthenticated || !token) {
      console.log('User is not authenticated or token is missing');
      return;
    }

    try {
      const response = await axios.get('/api/claim-tokens/last-claim-timestamp', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { lastTokenClaimTimestamp, serverCurrentTime } = response.data;

      if (lastTokenClaimTimestamp && serverCurrentTime) {
        const elapsedTime = serverCurrentTime - lastTokenClaimTimestamp;
        const remainingTime = Math.max(0, 24 * 60 * 60 * 1000 - elapsedTime);

        console.log('Elapsed time:', elapsedTime);
        console.log('Remaining time:', remainingTime);
        setCountdown(remainingTime);
        setIsActive(remainingTime <= 0);
      } else {
        console.error('Invalid response data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching last token claim timestamp:', error);
      if (error.response && error.response.status === 401) {
        logout();
      }
    }
  }, [isAuthenticated, token, logout]);

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchLastTokenClaimTimestamp();
      const intervalId = setInterval(fetchLastTokenClaimTimestamp, 60000);
      return () => clearInterval(intervalId);
    }
  }, [fetchLastTokenClaimTimestamp, isAuthenticated, token]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        const newCountdown = Math.max(0, prevCountdown - 1000);
        if (newCountdown === 0) {
          setIsActive(true);
          console.log('Countdown reached zero, button should be active now');
        }
        return newCountdown;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleClaimTokens = async () => {
    if (!isActive || !isAuthenticated || !token) {
      console.log('Button clicked but not active or user not authenticated or token missing');
      return;
    }

    try {
      setIsLoading(true);
      console.log('Claiming tokens...');
      const response = await axios.post('/api/claim-tokens/claim', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Claim response:', response.data);
      setIsActive(false);
      setCountdown(24 * 60 * 60 * 1000);
      setIsSuccess(true);
      refetchBalance();

      // Reset success state after 2 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('Error claiming tokens:', error);
      if (error.response && error.response.status === 401) {
        logout(); // Force logout if unauthorized
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  if (!isAuthenticated || !token) {
    return null; // Don't render the button if the user is not authenticated or token is missing
  }

  return (
    <button
      className={`relative mb-1 w-full rounded py-1 transition-colors duration-300 ${
        isSuccess
          ? 'bg-green-600 text-white'
          : isActive
            ? 'bg-blue-600 text-white hover:bg-blue-600'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
      }`}
      onClick={handleClaimTokens}
      disabled={!isActive || isSuccess || isLoading}
    >
      <div className="flex h-6 items-center justify-center">
        {isLoading ? (
          <span className="flex items-center">
            <FaSpinner className="mr-2 animate-spin" />
          </span>
        ) : (
          <>
            <span className={`${isSuccess ? 'invisible' : ''}`}>
              {isActive ? (
                localize('claim_active')
              ) : (
                <>
                  {localize('claim_inactive')} {formatTime(countdown)}
                </>
              )}
            </span>
            {isSuccess && (
              <span className="absolute inset-0 flex items-center justify-center animate-in fade-in">
                <FaRegThumbsUp />
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default ClaimTokensButton;