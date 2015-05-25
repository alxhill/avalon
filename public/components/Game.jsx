import {Card} from "./Card"
import {Board} from "./Board"
import {PlayerPicker} from "./PlayerPicker"
import {VetoPicker} from "./VetoPicker"
import {CardPicker} from "./CardPicker"
import {StartGame} from "./StartGame"

export var Game = React.createClass({

    getInitialState() {
        // for debugging purposes
        window.Game = this;
        this.props.socket.setUpdateListener(this.updateGameState);
        return {
            game: { State: "Init" },
            player: {},
            quest: {}
        }
    },

    updateGameState(state) {
        console.log("Updating game state", state);
        this.setState(state);
    },

    startQuest(index) {
        this.props.socket.startQuest(this.state.game.Name, index);
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

    choosePlayers() {
        this.props.socket.choosePlayers(this.state.game.Name, this.state.quest.Players);
    },

    addVeto(veto) {
        this.props.socket.addVeto(this.state.game.Name, this.state.player.Name, veto);
        this.wait();
    },

    chooseCards() {
        this.props.socket.chooseCards(this.state.game.Name);
    },

    pickCard(isSuccess) {
        this.props.socket.pickCard(this.state.game.Name, this.state.player.Name, isSuccess);
    },

    render() {
        if (this.state.game.State == "Init") {
            return <StartGame clickStart={this.props.socket.startGame}
                              clickJoin={this.props.socket.joinGame}/>
        }

        if (this.state.game.State == "Join") {
            return (
                <div className="join">
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
        switch (this.state.quest.State) {
            case "Start":
                if (this.state.game.Players[this.state.quest.Leader] == this.state.player.Name) {
                    flip = true;
                    backface = <PlayerPicker players={this.state.game.Players}
                                             chosenPlayers={this.state.quest.Players}
                                             submit={this.choosePlayers}
                                             addPlayer={this.addPlayer}/>;
                }
                break;
            case "Veto":
                flip = true;
                if (this.state.quest.VetoCount < this.state.game.PlayerCount) {
                    backface = <VetoPicker approve={this.addVeto.bind(this, false)}
                                           reject={this.addVeto.bind(this, true)}/>
                } else {
                    var success = this.state.quest.Vetos.length <= this.state.game.PlayerCount/2;
                    if (success) {
                        var rejected = this.state.quest.Vetos.length > 0 ? this.state.quest.Vetos.join(", ") : "No one";
                        backface = <div>
                            <p>{rejected} rejected the round. {this.state.quest.Players.join(", ")} will be going on a quest.</p>
                            {this.state.quest.Players.indexOf(this.state.player.Name) >= 0 ?
                                <button onClick={this.chooseCards}>Go On Quest!</button> :
                                <p>Waiting for players to finish quest...</p>}
                        </div>
                    } else {
                        backface = <div>
                            <p>{this.state.quest.Vetos.join(", ")} have vetoed the round.</p>
                            <button onClick={this.startQuest.bind(this, this.state.quest.Quest)}>Continue</button>
                        </div>
                    }
                }
                break;
            case "Cards":
                if (this.state.quest.Players.indexOf(this.state.player.Name) >= 0) {
                    flip = true;
                    backface = <CardPicker isGood={this.state.player.Good} pickCard={this.pickCard}/>;
                } else {
                    flip = false;
                }
                break;
            case "End":
                flip = true;
                var top;
                if (this.state.quest.Success)
                    top = <p>Quest Succeeded! The cards were: {this.state.quest.Cards.map((card)=> card ? "Success" : "Fail").join(", ")}</p>;
                else
                    top = <p>Quest Failed! The cards were: {this.state.quest.Cards.map((card)=> card ? "Success" : "Fail").join(", ")}</p>;
                backface = <div className="end-quest">
                    {top}
                    <button onClick={()=> {this.state.quest.State = "Init"; this.setState({quest: this.state.quest});}}>Continue</button>
                </div>
                break;
        }

        return (
            <main>
                <h1><img src="images/logo.png"/></h1>
                <div className="container">
                    <Board game={this.state.game} quest={this.state.quest}/>
                    <Card player={this.state.player}
                          quest={this.state.quest}
                          startQuest={this.startQuest}
                          flip={flip}>
                        {backface}
                    </Card>
                </div>
            </main>
        );
    }
});
