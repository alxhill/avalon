import {Game} from "./components/Game"
import {Socket} from "./socket"

var PlayerState = {
    Good: true,
    Card: "Merlin", // Merlin, Mordred, Oberon, Morgana, Percival, Assassin, Servant, Minion
    Name: "Alex",
    Mode: "Normal" // can be veto and quest for voting
};

Socket.init();

React.render(
    <Game socket={Socket} />,
    document.getElementsByTagName("body")[0]
);
