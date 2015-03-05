var Card = React.createClass({
    render() {
        var cx = React.addons.classSet;
        return (
            <div className={cx({card:true, "card-good":this.props.playerState.Good})}>
                <p>{`Player Name: ${this.props.playerState.Name}`}</p>
                <p>{`Card: ${this.props.playerState.Card}`}</p>
            </div>
        );
    }
});

export {Card};
