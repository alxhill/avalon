var Card = React.createClass({
    getDefaultProps() {
        return {
            flip: false
        }
    },

    render() {
        var cx = React.addons.classSet;
        var extra = null;
        if (this.props.playerState.EvilPlayers) {
            extra = <div>
                <h5>Evil Players</h5>
                <ul class="evil-list">
                    {this.props.playerState.EvilPlayers.map(player => <li key={player}>{player}</li>)}
                </ul>
            </div>
        } else if (this.props.playerState.Merlin) {
            var M = this.props.playerState.Merlin;
            if (Math.random() < 0.5) {
                var tmp = M[0];
                M[0] = M[1];
                M[1] = tmp;
            }
            if (M.length == 1)
                extra = <p>{M[0]} is Merlin</p>
            else
                extra = <p>Merlin is either {M[0]} or {M[1]}</p>
        }
        return (
            <div className={cx({"card-container":true, "card-good":this.props.playerState.Good})}>
                <div className={"card" + (this.props.flip ? " flip" : "")}>
                    <div className="card-front">
                        <p>{`Player Name: ${this.props.playerState.Name}`}</p>
                        <p>{`Card: ${this.props.playerState.Card}`}</p>
                        {extra}
                    </div>
                    <div className="card-back">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});

export {Card};
