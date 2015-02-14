var express = require('express');
var app = express();

var gameState = null;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/client.js', function(req, res) {
    res.sendFile(__dirname + "/client.js");
});

app.post('/start/:players', function(req, res) {
    var players = parseInt(req.params.players);

    if (players < 5 || players > 10) {
        res.status(400).send("must be between 5 and 10 players");
        return;
    }

    gameState = {
        playerCount: players,
        players: [],
        started: false
    };

    res.send("success");
});

app.post('/addplayer/:name', function(req, res) {
    if (gameState.players.length >= playerCount)
        return res.status(400).send("all players have already joined");

    gameState.players.push(req.params.name);
    if (gameState.players.length == playerCount)
        gameState.started = true;
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Avalon app listening at http://%s:%s", host, port);

});
