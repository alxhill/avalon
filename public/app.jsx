import {Game} from "./components/Game"
import {Socket} from "./socket"

Socket.init();

// // used for debugging the main game layout
// window.setTimeout(() => Socket.listener({
//     game: {
//         Name: "test",
//         PlayerCount: 5,
//         State: "Play",
//         Players: ["Alex", "James", "Andy", "Sam", "Berrow"],
//         Quests: [2, 3, 2, 3, 3],
//         Vetos: 0,
//         GoodCards: ["Merlin"],
//         EvilCards: ["Assassin"]
//     },
//     player: {
//         Name: "Alex",
//         Good: true,
//         Card: "Merlin",
//         Mode: "Normal"
//     },
//     quest: {
//         State: "Start",
//         Leader: -1,
//         Quest: 0,
//         Players: ["Alex", "James"],
//         Vetos: 0,
//         VetoCount: 0,
//         Cards: [],
//         Success: false
//     }
// }), 2000);

// window.setTimeout(() => Socket.listener({
//     quest: {
//         State: "Start",
//         Leader: 0,
//         Quest: 0,
//         Players: ["Alex", "James"],
//         Vetos: 0,
//         VetoCount: 0,
//         Cards: [],
//         Success: false
//     }
// }), 4000);


React.render(
    <Game socket={Socket} />,
    document.getElementsByTagName("body")[0]
);
