var socket = io();

var Socket = {
    // listener should be replaced with setUpdateListener
    listener() {
        console.warn("no update listener set!");
    },

    init() {
        socket.on('updateState', this.listener);
        socket.on('error', (error => alert(error)));
    },

    startGame: socket.emit.bind(socket, "start"),
    // startGame(players, gameName, playerName) {
    //     socket.emit('start', players, gameName, playerName);
    // },

    joinGame: socket.emit.bind(socket, "join"),
    // joinGame(gameName, playerName) {
    //     socket.emit('join', gameName, playerName);
    // },

    setUpdateListener(listener) {
        socket.off('updateState', this.listener);
        this.listener = listener;
        socket.on('updateState', this.listener);
    }

};

export {Socket};
