const
  mongoose  = require('mongoose'),
  Schema    = mongoose.Schema;

module.exports = mongoose.model('users', new Schema({
  full_name: { type: String },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  pass_hash: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  restore_password: {
    type: String,
    default: null,
  },
  status: { type: String }
}));