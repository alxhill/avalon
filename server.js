var express = require('express');
var app = express();

var gameState = null;

app.get('/', function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.get('/client.js', function(req, res) {
    res.sendFile(__dirname + "/client.js");
});

var server = app.listen(8080, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Avalon app listening at http://%s:%s", host, port);

});
