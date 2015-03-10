import {Game} from "./Game"

export var App = React.createClass({

    render() {
        var buttons = [];
        for (var i = 5; i <= 10; i++) {
            buttons.push(<button
                    onClick={this.props.Socket.startGame.bind(undefined, i)}
                    value={i}
                    key={i}>
                    {i + " Players"}
                </button>);
        }

        return (
            <div>
                <h2>Start New Game</h2>
                {buttons}
            </div>
        );
    }
});
