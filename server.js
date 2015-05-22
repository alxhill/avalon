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
var quests = {};
var players = {};

// server-only data
var _playerIds = {};

var io = socket(server);

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
    console.log("players:", randomPlayers);
    var evilNoMordred = [];
    var evilNoOberon = [];
    var merlinAndMorgana = [];
    for (var i = 0; i < randomPlayers.length; i++) {
        var player = randomPlayers[i];
        var card = allCards[i];
        card.Name = player.Name;
        if (!card.Good) {
            if (card.Card != "Mordred")
                evilNoMordred.push(player.Name);
            if (card.Card != "Oberon") {
                evilNoOberon.push(player.Name);
                card.EvilPlayers = evilNoOberon;
            }
            if (card.Card == "Morgana")
                merlinAndMorgana.push(player.Name);
        } else if (card.Card == "Merlin") {
            card.EvilPlayers = evilNoMordred;
            merlinAndMorgana.push(player.Name);
        } else if (card.Card == "Percival") {
            card.Merlin = merlinAndMorgana;
        }
        players[gameName][player.Name] = card;
    }

    // alert clients once all card data has been created
    for (var i = 0; i < randomPlayers.length; i++) {
        io.sockets.connected[randomPlayers[i].ID].emit('updateState', {player:allCards[i]});
    }
}

function startQuest(gameName, questIndex) {
    var q = quests[gameName];
    if (questIndex == null) questIndex = q.Quest+1;
    var newQuest = {
        State: "Start",
        Leader: (q.Leader+1)%(gstates[gameName].PlayerCount),
        Quest: questIndex,
        Players: [],
        Vetos: q.Vetos,
        VetoCount: 0,
        Cards: [],
        Success: false
    };

    newQuest.Players.push(gstates[gameName].Players[newQuest.Leader]);

    quests[gameName] = newQuest;
    updateState(gameName, {quest: newQuest});
}

function updateState(gameName, state) {
    io.in(gameName).emit('updateState', state);
}

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
            client.emit("err", "invalid game name " + gameName + " state is not Join or player name '" + playerName + "' is already taken");
            return;
        }
        client.join(gameName);
        console.log("new user '"+playerName+"' has joined");
        gstates[gameName].Players.push(playerName);
        players[gameName] = {};
        _playerIds[gameName].push({Name:playerName, ID:client.id});

        var newState = {game: gstates[gameName]};
        if (gstates[gameName].Players.length == gstates[gameName].PlayerCount) {
            gstates[gameName].State = "Play";
            quests[gameName] = {
                State: "Init", // Init, Start, Players, Veto, Cards, Quest, Success, Fail
                Leader: -1, // index in players array
                Quest: -1, // index in quests array
                Players: [],
                Vetos: [],
                VetoCount: 0,
                Cards: [],
                Success: false
            };
            assignCards(gameName);
            newState.quest = quests[gameName];
        }
        updateState(gameName, newState);
    });

    client.on('startQuest', function(gameName, questIndex) {
        console.log("STARTING QUEST OOH YAH");
        startQuest(gameName, questIndex);
    });

    client.on('choosePlayers', function(gameName, playerList) {
        quests[gameName].Players = playerList;
        quests[gameName].State = "Veto";
        updateState(gameName, {quest: quests[gameName]});
    });

    client.on('chooseCards', function(gameName, playerName) {
        quests[gameName].State = "Cards";
        updateState(gameName, {quest: quests[gameName]});
    });

    client.on('pickCard', function(gameName, playerName, isSuccess) {
        quests[gameName].Cards.push(isSuccess);
        quests[gameName].Players[quests[gameName].Players.indexOf(playerName)] = true;
        if (quests[gameName].Cards.length == quests[gameName].Players.length) {
            var success = _.all(quests[gameName].Cards,_.identity);
            quests[gameName].State = "End";
            quests[gameName].Success = success;
            quests[gameName].Cards = _.shuffle(quests[gameName].Cards);
            gstates[gameName].Quests[quests[gameName].Quest] = success;
        }
        updateState(gameName, {quest: quests[gameName], game: gstates[gameName]});
    });

    client.on('addVeto', function(gameName, playerName, veto) {
        console.log("veto from " + playerName + " " + veto, quests[gameName].VetoCount);
        quests[gameName].VetoCount++;
        if (veto)
            quests[gameName].Vetos.push(playerName);
        console.log("vetocount",quests[gameName].VetoCount, gstates[gameName].PlayerCount);
        if (quests[gameName].VetoCount === gstates[gameName].PlayerCount) {
            console.log("updating state of children");
            updateState(gameName, {quest:quests[gameName]});
        }
    });

    client.on('disconnect', function() {
        console.log('user has disconnected');
    });
});
