export var StartGame = React.createClass({

    goodCards: ["Merlin","Percival"],
    evilCards: ["Assassin", "Oberon", "Mordred", "Morgana"],

    getInitialState() {
        return {
            gameName: "",
            playerName: "",
            chooseCards: false,
            goodCardList: ["Merlin"],
            evilCardList: ["Assassin"]
        };
    },

    chooseCards() {
        this.setState({chooseCards: true});
    },

    toggleCard(type, evt) {
        var list = type == "good" ? this.state.goodCardList : this.state.evilCardList;
        if (!evt.target.checked) {
            list.splice(list.indexOf(evt.target.name), 1);
        } else {
            if (type == "evil") {
                var maxLen = Math.ceil(this.state.playerCount/2)-1;
                if (this.state.playerCount == 9) maxLen--;
                if (list.length < maxLen) {
                    list.push(evt.target.name);
                }
            } else {
                list.push(evt.target.name);
            }
        }
        this.setState({goodCardList: this.state.goodCardList, evilCardList: this.state.evilCardList});
    },

    clickJoin() {
        this.props.clickJoin(this.state.gameName, this.state.playerName);
    },

    clickStart() {
        this.props.clickStart(this.state.playerCount, this.state.gameName, this.state.playerName, this.state.goodCardList, this.state.evilCardList);
    },

    updateGameName(evt) {
        this.setState({gameName: evt.target.value});
    },

    updatePlayerName(evt) {
        this.setState({playerName: evt.target.value});
    },

    // used for debugging
    demoMode() {
        Game.setState({
            game: {
                Name: "test",
                PlayerCount: 5,
                State: "Play",
                Players: ["Alex", "James", "Andy", "Sam", "Berrow"],
                Quests: [2, 3, 2, 3, 3],
                Vetos: 0,
                GoodCards: ["Merlin"],
                EvilCards: ["Assassin"]
            },
            player: {
                Name: "Alex",
                Good: true,
                Card: "Merlin",
                Mode: "Normal"
            },
            quest: {
                State: "Start",
                Leader: -1,
                Quest: 0,
                Players: ["Alex", "James"],
                Vetos: 0,
                VetoCount: 0,
                Cards: [],
                Success: false
            }
        });

        window.setTimeout(() => Game.setState({
            quest: {
                State: "Start",
                Leader: 0,
                Quest: 0,
                Players: ["Alex", "James"],
                Vetos: 0,
                VetoCount: 0,
                Cards: [],
                Success: false
            }
        }), 2000);

        window.setTimeout(() => Game.setState({
            quest: {
                State: "Veto",
                Leader: 0,
                Quest: 0,
                Players: ["Alex", "James"],
                Vetos: 0,
                VetoCount: 0,
                Cards: [],
                Success: false
            }
        }), 4000);

        window.setTimeout(() => Game.setState({
            quest: {
                State: "Start",
                Leader: 2,
                Quest: 0,
                Players: ["Berrow", "Sam"],
                Vetos: 0,
                VetoCount: 0,
                Cards: [],
                Success: false
            },
            game: {
                Name: "test",
                PlayerCount: 5,
                State: "Play",
                Players: ["Alex", "James", "Andy", "Sam", "Berrow"],
                Quests: [true, false, 2, 3, 3],
                Vetos: 0,
                GoodCards: ["Merlin"],
                EvilCards: ["Assassin"]
            }
        }), 6000);
    },

    render() {
        if (this.state.chooseCards) {
            return (
                <div className="choose-cards">
                    <h4>Good Cards</h4>
                    <ul>
                        {this.goodCards.map(card => <div>
                            <input
                                type="checkbox"
                                checked={this.state.goodCardList.indexOf(card)>=0}
                                name={card}
                                onChange={this.toggleCard.bind(this, "good")}
                                />
                            <label htmlFor={card}>{card}</label>
                        </div>
                        )}
                    </ul>
                    <h4>Evil Cards</h4>
                    <ul>
                        {this.evilCards.map(card => <div>
                            <input
                                type="checkbox"
                                checked={this.state.evilCardList.indexOf(card)>=0}
                                name={card}
                                onChange={this.toggleCard.bind(this, "evil")}
                                />
                            <label htmlFor={card}>{card}</label>
                        </div>
                        )}
                    </ul>
                    <button type="Submit" onClick={this.clickStart}>Start Game</button>
                </div>
            );
        } else {
            var buttons = [];
            for (var i = 5; i <= 10; i++) {
                buttons.push(<button
                        onClick={evt => this.setState({playerCount:parseInt(evt.target.value), chooseCards:true})}
                        value={i}
                        key={i}>
                        {i + " Players"}
                    </button>);
            }
            return (
                <div className="start-game">
                    <input type="text" name="playerName" value={this.state.playerName} onChange={this.updatePlayerName} placeholder="Player Name" />
                    <input type="text" name="gameName" value={this.state.gameName} onChange={this.updateGameName} placeholder="Game Name" />
                    <h2>Start New Game</h2>
                    {buttons}
                    <h2>Join Game</h2>
                    <button type="Submit" onClick={this.clickJoin}>Join Game</button>
                    <h2>Demo Mode</h2>
                    <button type="Submit" onClick={this.demoMode}>View Board Demo</button>
                </div>
            );
        }
    }
});
