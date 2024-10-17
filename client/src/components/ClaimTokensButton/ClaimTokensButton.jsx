import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { FaRegThumbsUp, FaSpinner } from 'react-icons/fa';
import { useLocalize } from '~/hooks';
import { useAuthContext } from '~/hooks/AuthContext';

const CLAIM_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const ClaimTokensButton = ({ refetchBalance }) => {
  const localize = useLocalize();
  const { isAuthenticated, token } = useAuthContext();
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastClaimTimestamp, setLastClaimTimestamp] = useState(null);
  const [error, setError] = useState(null);

  const updateCountdown = useCallback(() => {
    if (lastClaimTimestamp) {
      const now = Date.now();
      const elapsedTime = now - lastClaimTimestamp;
      const remainingTime = Math.max(0, CLAIM_COOLDOWN - elapsedTime);
      setCountdown(remainingTime);
      setIsActive(remainingTime <= 0);
    }
  }, [lastClaimTimestamp]);

  useEffect(() => {
    const fetchLastClaimTimestamp = async () => {
      if (!isAuthenticated || !token) return;

      try {
        const response = await axios.get('/api/claim-tokens/last-claim-timestamp', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLastClaimTimestamp(response.data.lastTokenClaimTimestamp);
      } catch (error) {
        console.error('Error fetching last token claim timestamp:', error);
        setError('Failed to fetch last claim timestamp');
      }
    };

    fetchLastClaimTimestamp();
  }, [isAuthenticated, token]);

  useEffect(() => {
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [updateCountdown]);

  const handleClaimTokens = async () => {
    if (!isActive || !isAuthenticated || !token) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post('/api/claim-tokens/claim', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLastClaimTimestamp(Date.now());
      setIsActive(false);
      setCountdown(CLAIM_COOLDOWN);
      setIsSuccess(true);
      refetchBalance();

      setTimeout(() => setIsSuccess(false), 2500);
    } catch (error) {
      console.error('Error claiming tokens:', error);
      setError('Failed to claim tokens. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / (60 * 60 * 1000));
    const minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isAuthenticated || !token) return null;

  return (
    <>
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
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
};

export default ClaimTokensButton;