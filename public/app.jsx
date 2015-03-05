import {Game} from "./components/Game"

var GameState = {
    Players: ["Alex", "James", "Sam", "Andy", "Tom"],
    Quests: [true, false],
    Vetos: 0,
    CurrentQuest: {
        Leader: {}, // player object
        Players: [],
        Vetos: 0,
        Cards: [],
        Success: false
    }
};

var PlayerState = {
    Good: true,
    Card: "Merlin", // Merlin, Mordred, Oberon, Morgana, Percival, Assassin, Arthur, Minion
    Name: "Alex",
    Mode: "Normal" // can be veto and quest for voting
};

React.render(
    <Game gameState={GameState} playerState={PlayerState}/>,
    document.getElementsByTagName("body")[0]
);
