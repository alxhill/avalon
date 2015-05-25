import {Game} from "./components/Game"
import {Socket} from "./socket"

Socket.init();

React.render(
    <Game socket={Socket} />,
    document.getElementsByTagName("body")[0]
);
