import {Game} from "./components/Game"

var GameState = {
    Players: ["Alex", "James", "Sam", "Andy", "Tom", "Ben"],
    Quests: [],
    Vetos: 0,
    CurrentQuest: {
        State: "Start", // Start, Players, Veto, Cards, Quest, Success, Fail
        Leader: -1, // index in players array
        Quest: -1, // index in quests array
        Players: [],
        Vetos: 0,
        Cards: [],
        Success: false
    }
};

GameState.Quests = [];
var p = GameState.Players.length;
for (var m=1; m <= 5; m++) {
    GameState.Quests.push((2+(m>1)) + Math.floor(p/8) + (m>=4)*(p>=6) - (p<7)*(m+2==p));
}

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

setTimeout(() => {
    window.Game.startQuest();
}, 1000);
