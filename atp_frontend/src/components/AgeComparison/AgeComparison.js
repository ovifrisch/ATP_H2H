import React from 'react';
import CurrentPlayers from "./CurrentPlayers"
import Graph from "./Graph"
import PlayerSelector from "./PlayerSelector"

class AgeComparison extends React.Component {
	constructor(props) {
		super(props)
		this.graph = React.createRef()
	}

	handle_added_player(id) {
		this.graph.current.addPlayer(id)
	}

	render() {
		return (
			<div>
				<PlayerSelector added_player_handler={(pl_id) => this.handle_added_player(pl_id)} />
				<Graph ref={this.graph}/>
				<CurrentPlayers />
			</div>
		)
	}
}

export default AgeComparison;