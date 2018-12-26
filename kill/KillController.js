var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Kill = require('./Kill');
var perPage = 20;
router.get('/',function(req, res){
	Kill.find({})
	.limit(1000)
	.exec(function(err, kills){
		if (err) return res.status(500).send("There was an error getting the kills")
		res.status(200).send(kills);
	})
});

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
		if (err) return res.status(500).send(err);
		res.status(200).send(kills);
	})
});

router.get('/:id/:page', function(req, res){
	Kill.find({
		$or: [
			{victim: req.params.id},
			{killer: req.params.id}
		]
	})
	.populate('killer')
	.populate('victim')
	.limit(perPage)
	.skip(perPage * (req.params.page - 1))
	.sort({timeStamp: -1})
	.exec(function(err,kills) {
		if (err) return res.status(500).send("Error occurred getting the matchups")
		Kill.countDocuments({$or: [
			{victim: req.params.id},
			{killer: req.params.id}
		]})
		.exec(function(err, count){
			if (err) return res.status(500).send("Error occurred getting the count")
			var totalPages = Math.ceil(count / perPage);
			var previous_page_url;
			var next_page_url;

			if (req.params.page < 2) {
				previous_page_url = null;
			} else {
				previous_page_url = process.env.BASE_URL + 'kills/' + req.params.id + '/' +
				 + (Number(req.params.page) - 1);
			}

			if (req.params.page > totalPages - 1) {
				next_page_url = null;
			} else {
				next_page_url = process.env.BASE_URL + 'kills/' + req.params.id + '/' + (Number(req.params.page) + 1);
			}
			res.status(200).send({
				current_page: req.params.page,
				last_page: totalPages,
				next_page_url: next_page_url,
				prev_page_url: previous_page_url,
				data: kills
			});
		})
	})
});
module.exports = router;