require('dotenv').config();
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Request = require("request");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var Player = require('../player/Player')

router.get('/',function(req, res) {
    Request.get(process.env.BASE_URL+"players", (error, response, body) => {
        if (error) {
            return res.status(500).send("There was a problem getting the User list.");
        }else {
            let players = JSON.parse(body)
            res.render('pages/leaderboard', {players : players})
        }
    })
})

router.get('/:id', function(req, res) {
    console.log(process.env.BASE_URL + "kills/"+ req.params.id)
    console.log(process.env.BASE_URL+"players/"+ req.params.id)
    var kills = Request.get(process.env.BASE_URL + "kills/"+ req.params.id, (error, response, body) => {
        if (error) {
            return res.status(500).send("There was a problem getting the player list.");
        }else {
            return JSON.parse(body)
        }
    });
    var player = Request.get(process.env.BASE_URL+"players/"+ req.params.id, (error, response, body) => {
        if (error) {
            return res.status(500).send("There was a problem getting the player.");
        }else {
            return JSON.parse(body)
        }
    })
    res.render('pages/chart', {player : player, kills : kills})
})

module.exports = router;