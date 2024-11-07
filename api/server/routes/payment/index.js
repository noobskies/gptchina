// routes/payment/index.js
const stripe = require('./stripe');
const inapp = require('./inapp');

module.exports = {
  stripe,
  inapp,
};
