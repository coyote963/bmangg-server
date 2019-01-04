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
router.get('/weapons', function(req, res) {
	Kill
	.aggregate([
		{
			$group: {
				_id: '$weapon',
				count : {
					$sum: 1
				}
			}
		}
	])
	.sort({ count : -1})
	.limit(50)
	.exec(function(err, data) {
		if (err) return res.status(500).send("There was an error getting the weapons list");
		res.status(200).send(data);
	})
	
})
router.get('/weapons/:id', function(req, res){
	Kill
	.aggregate([
		{
			$match: {
				killer: req.params.id
			}
		}, {
			$group : {
				_id: '$weapon',
				count : {
					$sum: 1
				}
			} 
		}
	])
	.sort({'count' : -1})
	.exec(function(err, data) {
		if (err) return res.status(500).send("There was an error getting the weapons list");
		res.status(200).send(data);
	})
})

router.get('/weaponcounters/:id', function(req, res){
	Kill
	.aggregate([
		{
			$match: {
				victim: req.params.id
			}
		}, {
			$group : {
				_id: '$weapon',
				count : {
					$sum: 1
				}
			} 
		}
	])
	.sort({'count' : -1})
	.exec(function(err, data) {
		if (err) return res.status(500).send("There was an error getting the weapons list");
		res.status(200).send(data);
	})
})
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
	.sort({timeStamp: -1})
	.populate('killer')
	.populate('victim')
	.limit(perPage)
	.skip(perPage * (req.params.page - 1))
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
router.get('/:id/limit/:total',function(req, res){
	Kill.find({
		$or: [
			{victim: req.params.id},
			{killer: req.params.id}
		]
	})
	.sort({timeStamp : -1})
	.limit(parseInt(req.params.total))
	.exec(function (err, kills) {
		if (err) return res.status(500).send(err);
		res.status(200).send(kills);
	})
});


module.exports = router;