const
  mongoose  = require('mongoose'),
  Schema    = mongoose.Schema;

module.exports = mongoose.model('orders', new Schema({
  order: { type: Number },
  date: {
    type: Date,
    default: Date.now
  },
  payment: {
    all: { type: Number },
    introduced: {
      type: Number,
      default: 0
    }
  },
  done: { type: Boolean },
  sale: {
    type: Number,
    default: 0,
  },
  client: {
    type: Schema.ObjectId,
    ref: 'clientele'
  },
  list: [{
    itemID: { type: String },
    name: { type: String },
    article: { type: String },
    quantity: { type: Number },
    cost: {
      type: Number,
      default: 0,
    },
    orderCost: {
      type: Number,
      default: 0,
    },
    workman: {
      workman: {
        type: Schema.ObjectId,
        ref: 'workmans'
      },
      percent: { type: Number }
    }
  }]
}));