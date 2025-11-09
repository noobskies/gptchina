/**
 * CUSTOM: gptchina fork
 *
 * Feature: Buy Tokens (Stripe Integration)
 * Created: 2025-11-09
 * Upstream Impact: None (standalone module)
 *
 * Error handling utilities for payment processing.
 */

export enum PaymentErrorType {
  CARD_DECLINED = 'card_declined',
  INSUFFICIENT_FUNDS = 'insufficient_funds',
  EXPIRED_CARD = 'expired_card',
  INCORRECT_CVC = 'incorrect_cvc',
  NETWORK_ERROR = 'network_error',
  SERVER_ERROR = 'server_error',
  AUTHENTICATION_REQUIRED = 'authentication_required',
  PROCESSING_ERROR = 'processing_error',
  UNKNOWN = 'unknown',
}

/**
 * Map Stripe error codes to our error types
 * @param stripeError - Error object from Stripe
 * @returns PaymentErrorType enum value
 */
export const mapStripeError = (stripeError: any): PaymentErrorType => {
  if (!stripeError) {
    return PaymentErrorType.UNKNOWN;
  }

  const code = stripeError.code || stripeError.decline_code;

  switch (code) {
    case 'card_declined':
      return PaymentErrorType.CARD_DECLINED;
    case 'insufficient_funds':
      return PaymentErrorType.INSUFFICIENT_FUNDS;
    case 'expired_card':
      return PaymentErrorType.EXPIRED_CARD;
    case 'incorrect_cvc':
      return PaymentErrorType.INCORRECT_CVC;
    case 'authentication_required':
      return PaymentErrorType.AUTHENTICATION_REQUIRED;
    case 'processing_error':
      return PaymentErrorType.PROCESSING_ERROR;
    default:
      if (stripeError.message?.toLowerCase().includes('network')) {
        return PaymentErrorType.NETWORK_ERROR;
      }
      return PaymentErrorType.UNKNOWN;
  }
};

/**
 * Get user-friendly error message from error type
 * @param errorType - PaymentErrorType enum value
 * @returns User-friendly error message
 */
export const getErrorMessage = (errorType: PaymentErrorType): string => {
  switch (errorType) {
    case PaymentErrorType.CARD_DECLINED:
      return 'Your card was declined. Please try another payment method or contact your bank.';
    case PaymentErrorType.INSUFFICIENT_FUNDS:
      return 'Insufficient funds on your card. Please use a different payment method.';
    case PaymentErrorType.EXPIRED_CARD:
      return 'Your card has expired. Please use a different card.';
    case PaymentErrorType.INCORRECT_CVC:
      return 'Incorrect security code (CVC). Please check and try again.';
    case PaymentErrorType.AUTHENTICATION_REQUIRED:
      return 'Additional authentication required. Please complete the verification and try again.';
    case PaymentErrorType.NETWORK_ERROR:
      return 'Network error. Please check your internet connection and try again.';
    case PaymentErrorType.SERVER_ERROR:
      return 'Server error occurred. Please try again later.';
    case PaymentErrorType.PROCESSING_ERROR:
      return 'Error processing payment. Please try again.';
    default:
      return 'Payment failed. Please try again or contact support.';
  }
};

/**
 * Determine if error is retryable
 * @param errorType - PaymentErrorType enum value
 * @returns True if user should be encouraged to retry
 */
export const isRetryable = (errorType: PaymentErrorType): boolean => {
  switch (errorType) {
    case PaymentErrorType.NETWORK_ERROR:
    case PaymentErrorType.SERVER_ERROR:
    case PaymentErrorType.PROCESSING_ERROR:
      return true;
    default:
      return false;
  }
};
