import {Card} from "./Card"
import {Board} from "./Board"
import {PlayerPicker} from "./PlayerPicker"
import {VetoPicker} from "./VetoPicker"

export var Game = React.createClass({

    getInitialState() {
        window.Game = this;
        return {
            game: this.props.gameState,
            player: this.props.playerState
        }
    },

    startQuest() {
        var q = this.state.game.CurrentQuest;
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

        this.state.game.CurrentQuest = newQuest;
        this.setState({game: this.state.game});
    },

    wait() {
        this.state.game.CurrentQuest.State = "Waiting";
        this.setState({game: this.state.game});
    },

    addPlayer(e) {

        var players = this.state.game.CurrentQuest.Players;
        var player = e.target.innerText;

        if (player == this.state.player.Name) return;

        if (players.indexOf(player)>=0) {
            players.splice(players.indexOf(player), 1);
        } else if (players.length < this.state.game.Quests[this.state.game.CurrentQuest.Quest]) {
            players.push(player);
        }

        this.setState({game: this.state.game});
    },

    chooseVeto() {
        this.state.game.CurrentQuest.State = "Veto";
        this.setState({game: this.state.game});
    },

    addVeto() {
        this.state.game.CurrentQuest.Vetos++;
        this.wait();
    },

    vetoQuest() {

    },

    chooseCards() {
        this.state.game.CurrentQuest.State = "Cards";
        this.setState({game: this.state.game});
    },

    doQuest() {
        this.state.game.CurrentQuest.State = "Quest";
        this.setState({game: this.state.game});
    },

    questSuccess() {

    },

    questFail() {

    },

    render() {
        var backface = <p>Waiting for other players...</p>;
        switch (this.state.game.CurrentQuest.State) {
            case "Players":
                backface = <PlayerPicker players={this.state.game.Players}
                                         chosenPlayers={this.state.game.CurrentQuest.Players}
                                         submit={this.chooseVeto}
                                         addPlayer={this.addPlayer}/>
                break;
            case "Veto":
                backface = <VetoPicker approve={this.wait}
                                       reject={this.addVeto}/>
                break;
            case "Cards":
                backface = <p>Choose success/fail</p>;
                break;
        }

        return (
            <main>
                <h1>Avalon</h1>
                <div className="container">
                    <Board gameState={this.state.game}/>
                    <Card playerState={this.state.player}
                          flip={["Start","Quest"].indexOf(this.state.game.CurrentQuest.State) < 0}>
                        {backface}
                    </Card>
                </div>
            </main>
        );
    }
});
