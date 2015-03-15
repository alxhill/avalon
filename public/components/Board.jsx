var cx = React.addons.classSet;

var QuestPlace = React.createClass({

    propTypes: {
        text: React.PropTypes.string.isRequired,
        title: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <span className="quest">
                <h3>{this.props.title}</h3>
                <div className="place-container">
                    <p className="place-count">{this.props.text}</p>
                    <img src="images/board_small_circle.png" onDragStart={() => false}/>
                </div>
            </span>
        );
    }
});

var Board = React.createClass({
    render() {
        var p = this.props.gameState.Players.length;
        // mathsy magic to figure out the number of players in each quest
        var questList = this.props.gameState.Quests.map((quest, index) => {
            var text, title = "Quest " + (index + 1);

            if (typeof quest == "boolean") {
                text = quest ? "✓" : "✗";
            } else {
                text = quest.toString();
                if (p >= 7 && index == 3)
                    text += "*";
            }

            return <QuestPlace key={index} text={text} title={title}/>;
        });

        var vetoList = [];
        for (var i=0; i < 5; i++) {
            vetoList.push(<img key={i} src="images/board_small_circle.png" className={cx({'current-veto':i < this.props.gameState.Vetos})}/>);
        }

        var playerList = this.props.gameState.Players.map(
            (player, i) => <li
                key={player}
                className={cx({
                    current:i==this.props.quest.Leader,
                    chosen:this.props.quest.Players.indexOf(player)>=0
                })}>
                    {player}
                </li>);
        playerList.unshift(<li key="Players">Players:</li>);

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
