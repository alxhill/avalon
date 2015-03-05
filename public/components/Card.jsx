var Card = React.createClass({
    getInitialState() {
        return {
            flip: false
        }
    },

    render() {
        var cx = React.addons.classSet;
        return (
            <div className={cx({"card-container":true, "card-good":this.props.playerState.Good})}>
                <div className={"card" + (this.state.flip ? " flip" : "")} onClick={() => this.setState({flip: !this.state.flip})}>
                    <div className="card-front">
                        <p>{`Player Name: ${this.props.playerState.Name}`}</p>
                        <p>{`Card: ${this.props.playerState.Card}`}</p>
                    </div>
                    <div className="card-back">
                        <p>This is the back of the card</p>
                    </div>
                </div>
            </div>
        );
    }
});

export {Card};
