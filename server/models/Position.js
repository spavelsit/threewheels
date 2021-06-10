const
  mongoose  = require('mongoose'),
  Schema    = mongoose.Schema;

module.exports = mongoose.model('positions', new Schema({
  name: {
    type: String,
    required: true,
  },
  article: {
    type: String,
    default: 'Отсутствует',
  },
  quantity: {
    type: Number,
    default: 1,
  },
  cost: {
    type: Number,
    default: 1,
  },
  orderCost: {
    type: Number,
    default: 1,
  },
  type: {
    type: String,
    required: true
  },
}));