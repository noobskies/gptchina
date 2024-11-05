// server/services/payment/InAppService.js
const { logger } = require('~/config');

class InAppService {
  static async createPurchase({ amount, userId }) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }

  static async confirmPurchase({ purchaseId, userId }) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }

  static async handleWebhook(payload) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }
}

module.exports = InAppService;
