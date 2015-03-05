import {Card} from "./Card"
import {Board} from "./Board"

export var Game = React.createClass({
    render() {
        return (
            <main>
                <h1>Avalon</h1>
                <div className="container">
                    <Board gameState={this.props.gameState}/>
                    <Card playerState={this.props.playerState}/>
                </div>
            </main>
        );
    }
});
