var mongoose = require('mongoose');
var KillSchema = new mongoose.Schema(
{
	victim: String,
	victimRating: Number,
	killer: String,
	killerRating: Number,
	timeStamp: { type: Date, default: Date.now },
	weapon: String
})
mongoose.model('Kill', KillSchema);
module.exports = mongoose.model('Kill');
