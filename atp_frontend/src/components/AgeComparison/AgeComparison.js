import React from 'react';
import CurrentPlayers from "./CurrentPlayers"
import Graph from "./Graph"
import PlayerSelector from "./PlayerSelector"

class AgeComparison extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<PlayerSelector />
				<Graph />
				<CurrentPlayers />
			</div>
		)
	}
}

export default AgeComparison;