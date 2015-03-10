var socket = io();

export var Socket = {
    // listener should be replaced with setUpdateListener
    listener() {
        console.warn("no update listener set!");
    },

    init() {
        socket.on('updateState', this.listener);
    },

    startGame(players) {
        socket.emit('start', players);
    },

    setUpdateListener(listener) {
        socket.off('updateState', this.listener);
        this.listener = listener;
        socket.on('updateState', this.listener);
    }

};
