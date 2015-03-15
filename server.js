var _ = require('underscore');
var express = require('express');
var socket = require('socket.io');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Avalon app listening at http://%s:%s", host, port);

});

// these will be replaced with a database
var gstates = {};
var players = {};

// server-only data
var _playerIds = {};

function assignCards(gameName) {
    var randomPlayers = _.shuffle(_playerIds[gameName]);
    var goodCards = _.clone(gstates[gameName].GoodCards).map(function(cardName) {
        return {
            Good: true,
            Card: cardName,
            Mode: "Normal"
        };
    });
    var evilCards = _.clone(gstates[gameName].EvilCards).map(function(cardName) {
        return {
            Good: false,
            Card: cardName,
            Mode: "Normal"
        }
    });

    var evilCount = Math.ceil(gstates[gameName].PlayerCount/2)-1;
    if (gstates[gameName].PlayerCount == 9) evilCount--;
    var goodCount = gstates[gameName].PlayerCount - evilCount;

    while (evilCards.length < evilCount) evilCards.push({
        Good: false,
        Card: "Minion",
        Mode: "Normal"
    });
    while (goodCards.length < goodCount) goodCards.push({
        Good: true,
        Card: "Servant",
        Mode: "Normal"
    });
    var allCards = goodCards.concat(evilCards);
    console.log("cards:", allCards);
    console.log("players:", _playerIds[gameName]);
    for (var i = 0; i < _playerIds[gameName].length; i++) {
        var player = _playerIds[gameName][i];
        var card = allCards[i];
        card.Name = player.Name;
        var socket = io.sockets.connected[player.ID];
        players[gameName][player.Name] = card;
        socket.emit('updateState', {player:card});
    }
}

var io = socket(server);
io.on('connection', function(client) {
    console.log('new client connection');
    client.on('start', function(players, gameName, playerName, goodCards, evilCards) {
        console.log('starting new game called ' + gameName + ' with ' + players + ' players');
        var GameState = {
            Name: gameName,
            PlayerCount: players,
            State: "Join",
            Players: [playerName],
            Quests: [],
            Vetos: 0,
            GoodCards: goodCards,
            EvilCards: evilCards
        };
        var p = players;
        for (var m=1; m <= 5; m++)
            GameState.Quests.push((2+(m>1)) + Math.floor(p/8) + (m>=4)*(p>=6) - (p<7)*(m+2==p));
        client.join(gameName); // the first players id is the name of the room
        gstates[gameName] = GameState;
        _playerIds[gameName] = [{Name:playerName, ID: client.id}];
        client.emit('updateState', {game: GameState, player: {Name: playerName}});
    });

    client.on('join', function(gameName, playerName) {
        if (gstates[gameName] == null || gstates[gameName].State != "Join" || gstates[gameName].Players.indexOf(playerName) > 0) {
            console.log("invalid game name " + gameName + " state is not Join or player name '" + playerName + "' is already taken");
            return;
        }
        client.join(gameName);
        gstates[gameName].Players.push(playerName);
        players[gameName] = {};
        _playerIds[gameName].push({Name:playerName, ID:client.id});

        var newState = {game: gstates[gameName]};
        if (gstates[gameName].Players.length == gstates[gameName].PlayerCount) {
            gstates[gameName].State = "Play";
            newState.quest = {
                State: "Start", // Start, Players, Veto, Cards, Quest, Success, Fail
                Leader: -1, // index in players array
                Quest: -1, // index in quests array
                Players: [],
                Vetos: 0,
                Cards: [],
                Success: false
            };
            assignCards(gameName);
        }
        io.in(gameName).emit('updateState', newState);
        console.log('new user has joined');
    });

    client.on('disconnect', function() {
        console.log('user has disconnected');
    });
});
