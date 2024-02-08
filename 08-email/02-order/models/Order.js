const mongoose = require('mongoose');
const connection = require('../libs/connection');

const re = new RegExp(/\+?\d{6,14}/);

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return re.test(value);
      },
      message: 'Неверный формат номера телефона.',
    },
  },
  address: {
    type: String,
    required: true,
  },
});

module.exports = connection.model('Order', orderSchema);
