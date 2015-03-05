var QuestPlace = React.createClass({

    propTypes: {
        quest: React.PropTypes.number.isRequired,
        number: React.PropTypes.number.isRequired,
        star: React.PropTypes.bool
    },

    getDefaultState() {
        return {visited: false}
    },

    render() {
        var text = this.props.number.toString() + (this.props.star ? "*" : "");
        var title = "Quest " + this.props.quest;
        return (
            <span className="quest">
                <h3>{title}</h3>
                <div className="place-container">
                    <p className="place-count">{text}</p>
                    <img src="images/board_small_circle.png"/>
                </div>
            </span>
        );
    }
});

var Board = React.createClass({
    propTypes: {
        players: React.PropTypes.number.isRequired
    },

    render() {
        var p = this.props.players;
        var questList = [];
        for(var m=1; m <= 5; m++) {
            var hasStar = p >= 7 && m == 4;
            var playerCount = (2+(m>1)) + Math.floor(p/8) + (m>=4)*(p>=6) - (m<7)*(m+2==p);
            questList.push(<QuestPlace quest={m} star={hasStar} number={playerCount} />);
        }

        return (
            <div className="board">
                <div className="quests">
                    {questList}
                </div>
            </div>
        );
    }
});


export {Board};
