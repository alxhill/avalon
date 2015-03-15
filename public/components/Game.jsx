import {Card} from "./Card"
import {Board} from "./Board"
import {PlayerPicker} from "./PlayerPicker"
import {VetoPicker} from "./VetoPicker"
import {StartGame} from "./StartGame"

export var Game = React.createClass({

    getInitialState() {
        window.Game = this;
        this.props.socket.setUpdateListener(this.updateGameState);
        return {
            game: { State: "Init" },
            player: {},
            quest: {}
        }
    },

    updateGameState(state) {
        this.setState(state);
    },

    startQuest() {
        var q = this.state.quest;
        var newQuest = {
            State:"Start",
            Leader: (q.Leader+1)%(this.state.game.Players.length),
            Quest: q.Quest+1,
            Players: [],
            Vetos: q.Vetos,
            Cards: [],
            Success: false
        };

        if (this.state.game.Players[newQuest.Leader] == this.state.player.Name) {
            newQuest.State = "Players";
            newQuest.Players.push(this.state.player.Name);
        } else {
            newQuest.State = "Waiting";
        }

        this.setState({quest: newQuest});
    },

    wait() {
        this.state.quest.State = "Waiting";
        this.setState({game: this.state.game});
    },

    addPlayer(e) {

        var players = this.state.quest.Players;
        var player = e.target.innerText;

        if (player == this.state.player.Name) return;

        if (players.indexOf(player)>=0) {
            players.splice(players.indexOf(player), 1);
        } else if (players.length < this.state.game.Quests[this.state.quest.Quest]) {
            players.push(player);
        }

        this.setState({quest: this.state.quest});
    },

    chooseVeto() {
        this.state.quest.State = "Veto";
        this.setState({game: this.state.game});
    },

    addVeto() {
        this.state.quest.Vetos++;
        this.wait();
    },

    vetoQuest() {

    },

    chooseCards() {
        this.state.quest.State = "Cards";
        this.setState({game: this.state.game});
    },

    doQuest() {
        this.state.quest.State = "Quest";
        this.setState({game: this.state.game});
    },

    questSuccess() {

    },

    questFail() {

    },

    render() {
        if (this.state.game.State == "Init") {
            return <StartGame clickStart={this.props.socket.startGame}
                              clickJoin={this.props.socket.joinGame}/>
        }

        if (this.state.game.State == "Join") {
            return (
                <div>
                    <h3>Waiting for players...</h3>
                    <p>{`Game is called ${this.state.game.Name}`}</p>
                    <ul>
                        {this.state.game.Players.map(player => <li key={player}>{player}</li>)}
                    </ul>
                </div>
            );
        }


        var backface = <p>Waiting for other players...</p>;
        var flip = false;
        if (this.state.quest.State == "Start" && this.state.game.Players[this.state.quest.Leader] == this.state.player.Name) {
            flip = true;
            backface = <PlayerPicker players={this.state.game.Players}
                                     chosenPlayers={this.state.quest.Players}
                                     submit={this.chooseVeto}
                                     addPlayer={this.addPlayer}/>;
        } else if (this.state.quest.State == "Veto") {
            flip = true;
            backface = <VetoPicker approve={this.wait}
                                   reject={this.addVeto}/>
        } else if (this.state.quest.State == "Cards") {
            flip = true
            backface = <p>Choose success/fail</p>;
        }

        return (
            <main>
                <h1>Avalon</h1>
                <div className="container">
                    <Board gameState={this.state.game} quest={this.state.quest}/>
                    <Card playerState={this.state.player}
                          flip={flip}>
                        {backface}
                    </Card>
                </div>
            </main>
        );
    }
});
