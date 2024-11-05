// server/utils/payment.js
/**
 * Converts a token amount to the appropriate currency amount in cents
 * @param {number} tokens - Number of tokens to convert
 * @returns {number} Amount in cents
 */
function calculateTokenAmount(tokens) {
  // Example conversion rate: 1000 tokens = $1
  const ratePerDollar = 1000;
  const dollars = tokens / ratePerDollar;
  // Convert to cents (Stripe uses smallest currency unit)
  return Math.round(dollars * 100);
}

/**
 * Validates a payment amount
 * @param {number} amount - Amount to validate
 * @returns {boolean} Whether the amount is valid
 */
function validatePaymentAmount(amount) {
  return amount > 0 && amount <= 1000000; // Example: max $10,000
}

module.exports = {
  calculateTokenAmount,
  validatePaymentAmount,
};
