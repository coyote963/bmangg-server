var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Kill = require('./Kill');
var perPage = 1000;

router.get('/page/:page', function(req,res){
	Kill.find({})
	.limit(perPage)
	.skip(perPage * req.params.page)
	.exec(function(err, kills) {
		if (err) return res.status(500).send("There was a problem finding the kills.");
		res.status(200).send(kills);
	})
});


router.post('/', function(req,res){
	Kill.create({
		victim: req.body.victim,
		victimRating: req.body.victimRating,
		killer: req.body.killer,
		killerRating: req.body.killerRating,
		weapon: req.body.weapon
	},function (err, user) {
		if (err) return res.status(500).send("There was a problem adding the information to the database.");
		res.status(200).send(user);
	})
});

router.get('/:id', function(req, res){
	Kill.find({
		$or: [
			{victim: req.params.id},
			{killer: req.params.id}
		]
	}, function (err, kills) {
		if (err) return res.status(500).send("There was a problem fetching that kills");
		res.status(200).send(kills);
	})
}); 
module.exports = router;