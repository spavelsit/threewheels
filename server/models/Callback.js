const
  mongoose  = require('mongoose'),
  Schema    = mongoose.Schema;

module.exports = mongoose.model('callback', new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  date_added: {
    type: Date,
    default: Date.now,
  },
  date_modified: {
    type: Date,
    default: null
  },
}));