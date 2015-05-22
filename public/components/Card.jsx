var Card = React.createClass({
    getDefaultProps() {
        return {
            flip: false
        }
    },

    render() {
        var cx = React.addons.classSet;
        var q = this.props.quest;
        var p = this.props.player;

        var extra = null;
        if (p.EvilPlayers) {
            extra = <p className="evil-list">Evil Players: {p.EvilPlayers.join(",")}</p>
        } else if (p.Merlin) {
            if (M.length == 1)
                extra = <p>{M[0]} is Merlin</p>
            else {
                var M = p.Merlin;
                if (Math.random() < 0.5) {
                    var tmp = M[0];
                    M[0] = M[1];
                    M[1] = tmp;
                }
                extra = <p>Merlin is either {M[0]} or {M[1]}</p>
            }

        }

        return (
            <div className={cx({"card-container":true, "card-good":p.Good})}>
                <div className={"card" + (this.props.flip ? " flip" : "")}>
                    <div className="card-front">
                        <p>{`Player Name: ${p.Name}`}</p>
                        <p>{`Card: ${p.Card}`}</p>
                        {extra}
                        {q.State == "Init" ? <button className="start-quest" onClick={() => this.props.startQuest()}>Start Quest</button> : null}
                    </div>
                    <div className="card-back">
                        {this.props.children}
                        {extra}
                    </div>
                </div>
            </div>
        );
    }
});

export {Card};
