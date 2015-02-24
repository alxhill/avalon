var express = require('express');
var path = require('path');
var app = express();

var gameState = null;

app.use(express.static(path.join(__dirname, 'public')));

app.post('/start/:players', function(req, res) {
    if (gameState)
        return res.status(400).send("A game is currently in progress, please end the current game before starting a new one");
    var players = parseInt(req.params.players);

    if (players < 5 || players > 10)
        return res.status(400).send("must be between 5 and 10 players");

    gameState = {
        playerCount: players,
        players: [],
        started: false
    };

    res.send("success");
});

app.post('/addplayer/:name', function(req, res) {
    if (gameState == null)
        return res.status(400).send("game has not been started");

    if (gameState.players.length >= gameState.playerCount)
        return res.status(400).send("all players have already joined");

    gameState.players.push(req.params.name);
    if (gameState.players.length == gameState.playerCount)
        gameState.started = true;

    res.send("Added player " + req.params.name);
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Avalon app listening at http://%s:%s", host, port);

});
