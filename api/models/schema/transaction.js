// api/models/schema/transaction.js
const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: true,
    },
    conversationId: {
      type: String,
      ref: 'Conversation',
      index: true,
    },
    tokenType: {
      type: String,
      enum: ['prompt', 'completion', 'credits'],
      required: true,
    },
    model: {
      type: String,
    },
    context: {
      type: String,
    },
    valueKey: {
      type: String,
    },
    rate: Number,
    rawAmount: Number,
    tokenValue: Number,
    inputTokens: { type: Number },
    writeTokens: { type: Number },
    readTokens: { type: Number },
    // Add payment-related fields
    paymentId: { type: String, sparse: true }, // Stripe payment intent ID
    priceId: { type: String, sparse: true }, // Stripe price ID
  },
  {
    timestamps: true,
  },
);

transactionSchema.index({ paymentId: 1 }, { sparse: true });

module.exports = transactionSchema;
