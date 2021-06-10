const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = mongoose.model('workmans', new Schema({
	full_name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	address: {
    type: String
  },
  percent: {
    type: Number
  }
}));