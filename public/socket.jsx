var socket = io();

var Socket = {
    // listener should be replaced with setUpdateListener
    listener() {
        console.warn("no update listener set!");
    },

    init() {
        socket.on('updateState', this.listener);
        socket.on('err', (error => alert(error)));
        socket.on('alert', (msg => alert(msg.text)));
    },

    startGame: socket.emit.bind(socket, "start"),

    joinGame: socket.emit.bind(socket, "join"),

    startQuest: socket.emit.bind(socket, "startQuest"),

    choosePlayers: socket.emit.bind(socket, "choosePlayers"),

    addVeto: socket.emit.bind(socket, "addVeto"),

    setUpdateListener(listener) {
        socket.off('updateState', this.listener);
        this.listener = listener;
        socket.on('updateState', this.listener);
    }

};

export {Socket};
