var cx = React.addons.classSet;

var QuestPlace = React.createClass({

    propTypes: {
        questNumber: React.PropTypes.number.isRequired,
        playerCount: React.PropTypes.number.isRequired,
        star: React.PropTypes.bool,
        visited: React.PropTypes.bool,
        success: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            visited: false
        }
    },

    render() {
        var text = this.props.playerCount.toString() + (this.props.star ? "*" : "");
        var title = "Quest " + this.props.questNumber;

        if (this.props.visited) {
            text = this.props.success ? "✓" : "✗";
        }

        return (
            <span className="quest">
                <h3>{title}</h3>
                <div className="place-container">
                    <p className="place-count">{text}</p>
                    <img src="images/board_small_circle.png" onDragStart={() => false}/>
                </div>
            </span>
        );
    }
});

var Board = React.createClass({
    render() {
        var p = this.props.gameState.Players.length;
        var questList = [];
        // mathsy magic to figure out the right number of players in each quest
        for(var m=1; m <= 5; m++) {
            var hasStar = p >= 7 && m == 4;
            var playerCount = (2+(m>1)) + Math.floor(p/8) + (m>=4)*(p>=6) - (m<7)*(m+2==p);
            questList.push(<QuestPlace
                key={m}
                questNumber={m}
                star={hasStar}
                playerCount={playerCount}
                visited={m<=this.props.gameState.Quests.length}
                success={this.props.gameState.Quests[m-1]} />);
        }

        var vetoList = [];
        for (var i=0; i < 5; i++) {
            vetoList.push(<img key={i} src="images/board_small_circle.png" className={cx({'current-veto':i < this.props.gameState.Vetos})}/>);
        }

        var playerList = this.props.gameState.Players.map(
            (player, i) => <li
                key={player}
                className={cx({current:i==this.props.gameState.CurrentQuest.Leader})}>
                {player}
            </li>);
        playerList.unshift(<li>Players:</li>);

        return (
            <div className="board">
                <ul className="players">
                    {playerList}
                </ul>
                <div className="quests">
                    {questList}
                </div>
                <div className="vetos">
                    <h2>Veto Track</h2>
                    {vetoList}
                </div>
            </div>
        );
    }
});

export {Board};
