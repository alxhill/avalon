var VetoPicker = React.createClass({
    render() {
        return (
            <div className="veto-picker">
                <h3>Do you wish to veto the round?</h3>
                <div className="veto-button veto-approve" onClick={this.props.approve}></div>
                <div className="veto-button veto-reject" onClick={this.props.reject}></div>
            </div>
        )
    }
});

export {VetoPicker}
