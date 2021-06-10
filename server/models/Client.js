const
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.exports = mongoose.model('clientele', new Schema({
	full_name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: true
	},
	car: {
		brand: {
			type: String
		},
		model: {
			type: String
		}
	}
}));