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
        var imageName = "images/board_" + this.props.number.toString() + (this.props.star ? "_star" : "") + ".png";
        var className = "place-count" + (this.props.star ? " place-count-str" : "");
        return (
            <span className="quest">
                <h3>Quest {this.props.quest}</h3>
                <div className="place-container">
                    <img className={className} src={imageName} />
                    <img src="images/board_circle.png"/>
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
            <div id="board">
                <div id="quests">
                    {questList}
                </div>
                <img src="images/board.png"/>
            </div>
        );
    }
});


export {Board};
