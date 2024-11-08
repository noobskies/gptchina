// api/models/schema/balance.js
const mongoose = require('mongoose');
const { date } = require('zod');

const balanceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    required: true,
  },
  tokenCredits: {
    type: Number,
    default: 0,
  },
  lastTokenClaim: {
    type: Date,
    default: date.now,
  },
});

module.exports = balanceSchema;
