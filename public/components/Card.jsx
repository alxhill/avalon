var Card = React.createClass({
    getDefaultProps() {
        return {
            flip: false
        }
    },

    render() {
        var cx = React.addons.classSet;
        return (
            <div className={cx({"card-container":true, "card-good":this.props.playerState.Good})}>
                <div className={"card" + (this.props.flip ? " flip" : "")}>
                    <div className="card-front">
                        <p>{`Player Name: ${this.props.playerState.Name}`}</p>
                        <p>{`Card: ${this.props.playerState.Card}`}</p>
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
