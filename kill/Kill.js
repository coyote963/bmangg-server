var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const KillSchema = new mongoose.Schema(
{
	victim: { type: String, ref: 'Player' },
	victimRating: Number,
	killer: { type: String, ref: 'Player' },
	killerRating: Number,
	timeStamp: { type: Date, default: Date.now },
	weapon: String
})
mongoose.model('Kill', KillSchema);
module.exports = mongoose.model('Kill');
