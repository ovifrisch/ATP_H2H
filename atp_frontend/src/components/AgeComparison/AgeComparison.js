import React from 'react';
import CurrentPlayers from "./CurrentPlayers"
import Graph from "./Graph"
import PlayerSelector from "./PlayerSelector"
import AgeSlider from "./AgeSlider"

class AgeComparison extends React.Component {
	constructor(props) {
		super(props)
		this.graph = React.createRef()
	}

	handle_slider_change(val) {

		this.graph.current.changeAgeRange(val[0], val[1])
	}

	handle_added_player(id, name) {
		this.graph.current.addPlayer(id, name)
	}

	render() {
		return (
			<div>
				<PlayerSelector added_player_handler={(pl_id, pl_name) => this.handle_added_player(pl_id, pl_name)} />
				<Graph ref={this.graph}/>
				<AgeSlider slider_handler={(val) => this.handle_slider_change(val)}/>
				<CurrentPlayers />
			</div>
		)
	}
}

export default AgeComparison;