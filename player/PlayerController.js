var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var perPage = 20;

var Player = require('./Player');
router.post('/', function (req, res) {
	Player.create({
		name : req.body.name,
		_id : req.body.steamid,
		elo : req.body.elo
	},
	function (err, user) {
		if (err) return res.status(500).send("There was a problem adding the information to the database.");
		res.status(200).send(user);
	});
});

router.get('/',function(req,res) {
	Player.find({},['_id','name','elo'],{
		sort: {
			elo : -1
		}
	}, function(err, players) {
		if (err) return res.status(500).send("There was a problem finding the players.");
		res.status(200).send(players);
	});
});

router.get('/:id', function (req,res) {
	Player.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the player.");
		if (!user) return res.status(404).send("No User found.");
		res.status(200).send(user);
	});
});

router.get('/rank/:id', function (req, res) {
	Player.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the player.");
		if (!user) return res.status(404).send("No user found with that ID");	
		Player.countDocuments( { elo: { $gte: user.elo } }, function (err, count) {
			if (err) return res.status(500).send("There was an error getting the ranking.");
			res.status(200).send({
				user: user,
				rank: count
			})
		})
	})
})

router.get('/page/:page', function (req,res) {
	Player.find({})
	.limit(perPage)
	.skip(perPage * (req.params.page - 1))
	.sort( {elo : -1})
	.exec(function(err, players) {
		if (err) return res.status(500).send("Did not provide page number");
		Player.countDocuments().exec(function(err, count){
			if (err) return res.status(500).send("There was a problem getting that page");
			var totalPages = Math.ceil(count / perPage);
			var previous_page_url;
			var next_page_url;

			if (req.params.page < 2) {
				previous_page_url = null;
			} else {
				previous_page_url = process.env.BASE_URL + "players/page/" + (Number(req.params.page) - 1);
			}

			if (req.params.page > totalPages - 1) {
				next_page_url = null;
			} else {
				next_page_url = process.env.BASE_URL + "players/page/" + (Number(req.params.page) + 1);
			}
			res.status(200).send({
				current_page: req.params.page,
				last_page: totalPages,
				next_page_url: next_page_url,
				prev_page_url: previous_page_url,
				data: players
			});
		})
	});
});


router.put('/:id', function(req,res) {
	Player.findByIdAndUpdate(req.params.id, req.body, {new: true, upsert: true, setDefaultsOnInsert: true}, function(err, user) {
		if (err) return res.status(500).send("There was a problem updating the player.");
		res.status(200).send(user);
	});
});

router.delete('/:id', function (req,res) {
	Player.findByIdAndRemove(req.params.id, function (err, player) {
		if (err) return res.status(500).send("There was a problem deleting the player.");
		if (!player) return res.status(404).send("No player found.");
		res.status(200).send("Player "+player.name+" was deleted.");
	})
});

router.put('/rating/:newrating', function(req,res) {
	Player.findOneAndUpdate(
		{_id : req.body.steamid},
		{$set: {elo: req.params.newrating}},
		{new: true},
		function(err, user) {
			if (err) return res.status(500).send("There was a problem updating the player.");
			res.status(200).send(user);
		}
	)
});

module.exports = router;