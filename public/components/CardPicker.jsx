var CardPicker = React.createClass({
    getDefaultProps() {
        return {
            isGood: true
        };
    },

    render() {
        var cards = [true, this.props.isGood];
        if (Math.random() < 0.5)
            cards.reverse();
        return (
            <div className="card-picker">
                <h3>Choose a card</h3>
                {cards.map((card) => {
                    var c = "quest-card " + (card ? "quest-card-success" : "quest-card-fail");
                    return <div className={c} onClick={this.props.pickCard.bind(null, card)}></div>;
                })}
            </div>
        );
    }
});


export {CardPicker}
