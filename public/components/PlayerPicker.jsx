var PlayerPicker = React.createClass({
    render() {
        return (
            <div className="player-picker">
                <h3>Choose Players to join your quest</h3>
                <ul>
                    {this.props.players.map(
                        player => <li
                            className={(this.props.chosenPlayers.indexOf(player)>=0) ? "chosen" : ""}
                            onClick={this.props.addPlayer}
                            key={player}>
                                {player}
                            </li>)}
                </ul>
                <a onClick={this.props.submit} className="picker-button">Choose Players</a>
            </div>
        );
    }
});

export {PlayerPicker}
