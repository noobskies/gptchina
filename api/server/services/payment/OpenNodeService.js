// server/services/payment/OpenNodeService.js
const { logger } = require('~/config');

class OpenNodeService {
  static async createCharge({ amount, userId }) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }

  static async confirmPayment({ chargeId, userId }) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }

  static async handleWebhook(payload, signature) {
    // Implementation coming soon
    throw new Error('Not implemented yet');
  }
}

module.exports = OpenNodeService;
