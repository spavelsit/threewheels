const
  mongoose  = require('mongoose'),
  Schema    = mongoose.Schema;

module.exports = mongoose.model('orders', new Schema({
  order: {
    type: Number,
  },
  sale: {
    type: Number,
    default: 0,
  },
  mechanic: {
    type: String
  },
  percent: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  list: [{
    itemID: {
      type: String,
    },
    name: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    cost: {
      type: Number,
      default: 0,
    },
    orderCost: {
      type: Number,
      default: 0,
    },
    type: {
      type: String
    },
  }]
}));