var express = require('express');
var socketio = require('socket.io');
var path = require('path');
var app = express();

var gameState = null;

app.use(express.static(path.join(__dirname, 'public')));

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Avalon app listening at http://%s:%s", host, port);

});

var io = socketio(server);
io.on('connection', function(socket) {
    console.log('new socket connection');
    socket.on('start', function(data) {
        console.log(data);
    });


    socket.on('disconnect', function() {
        console.log('user has disconnected');
    });
});
