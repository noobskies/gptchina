// routes/payment/index.js
const stripe = require('./stripe');
const opennode = require('./opennode');
const inapp = require('./inapp');

module.exports = {
  stripe,
  opennode,
  inapp,
};
