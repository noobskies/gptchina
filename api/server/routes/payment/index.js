// routes/payment/index.js
const stripe = require('./stripe');
const inapp = require('./inapp');
const opennode = require('./opennode');

module.exports = {
  stripe,
  inapp,
  opennode,
};
