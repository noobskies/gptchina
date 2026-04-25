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
 * @param localize - Localization function
 * @returns User-friendly error message
 */
export const getErrorMessage = (errorType: PaymentErrorType, localize: any): string => {
  switch (errorType) {
    case PaymentErrorType.CARD_DECLINED:
      return localize('com_custom_tokens_buy_error_card_declined');
    case PaymentErrorType.INSUFFICIENT_FUNDS:
      return localize('com_custom_tokens_buy_error_insufficient_funds');
    case PaymentErrorType.EXPIRED_CARD:
      return localize('com_custom_tokens_buy_error_expired_card');
    case PaymentErrorType.INCORRECT_CVC:
      return localize('com_custom_tokens_buy_error_incorrect_cvc');
    case PaymentErrorType.AUTHENTICATION_REQUIRED:
      return localize('com_custom_tokens_buy_error_auth_required');
    case PaymentErrorType.NETWORK_ERROR:
      return localize('com_custom_tokens_buy_error_network');
    case PaymentErrorType.SERVER_ERROR:
      return localize('com_custom_tokens_buy_error_server');
    case PaymentErrorType.PROCESSING_ERROR:
      return localize('com_custom_tokens_buy_error_processing');
    default:
      return localize('com_custom_tokens_buy_error_generic');
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
