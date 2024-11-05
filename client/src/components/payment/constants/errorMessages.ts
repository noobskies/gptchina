export const ERROR_MESSAGES = {
  PAYMENT_FAILED: {
    title: 'com_ui_payment_error_title',
    message: 'com_ui_payment_error_message',
  },
  INVALID_AMOUNT: {
    title: 'com_ui_payment_invalid_amount_title',
    message: 'com_ui_payment_invalid_amount_message',
  },
  NETWORK_ERROR: {
    title: 'com_ui_payment_network_error_title',
    message: 'com_ui_payment_network_error_message',
  },
  UNSUPPORTED_REGION: {
    title: 'com_ui_payment_region_error_title',
    message: 'com_ui_payment_region_error_message',
  },
  PAYMENT_CANCELLED: {
    title: 'com_ui_payment_cancelled_title',
    message: 'com_ui_payment_cancelled_message',
  },
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
