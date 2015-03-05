import {Card} from "./Card"
import {Board} from "./Board"

export var Game = React.createClass({
    render() {
        return (
            <main>
                <h1>Avalon</h1>
                <div className="container">
                    <Board players={8}/>
                    <Card/>
                </div>
            </main>
        );
    }
});

