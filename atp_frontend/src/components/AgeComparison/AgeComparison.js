import React from 'react';
import CurrentPlayers from "./CurrentPlayers"
import Graph from "./Graph"
import PlayerSelector from "./PlayerSelector"

class AgeComparison extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			players: []
		}
	}

	handle_added_player(id) {
		this.setState({
			players: [...this.state.players, id]
		})
	} 

	render() {
		return (
			<div>
				<PlayerSelector added_player_handler={(pl_id) => this.handle_added_player(pl_id)} />
				<Graph players = {this.state.players} />
				<CurrentPlayers />
			</div>
		)
	}
}

export default AgeComparison;