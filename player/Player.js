var mongoose = require('mongoose');
var PlayerSchema = new mongoose.Schema({
	name: String,
	_id: String,
	elo: {type: Number, default: 1000 },
	date_created: {type : Date, default : Date.now}
});
PlayerSchema.index({name: 'text'});
mongoose.model('Player', PlayerSchema);
module.exports = mongoose.model('Player');
