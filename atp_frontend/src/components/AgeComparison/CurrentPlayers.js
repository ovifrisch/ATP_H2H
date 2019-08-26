import React from 'react';

class CurrentPlayers extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			players: props.players
		}
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			players: nextProps.players
		})
	}

	render() {
		return "current players"
	}
}

export default CurrentPlayers;