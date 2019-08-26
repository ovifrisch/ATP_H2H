import React from 'react';
var ChartistGraph = require('react-chartist')

class Graph extends React.Component {
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

		// maybe here you could look at the difference between the old props and the new props and
		// only fetch the data that is new

		var ranking_histories = []
		for (var i = 0; i < this.state.players.length; i++) {
			var id = this.state.players[i]
			fetch(`/get_ranking_history?player_id=${id}&starting_age=25&ending_age=26`).then(response => 
				response.json().then(data => {
					console.log(data)
					ranking_histories.push({id: id, data: data})
			}))
		}
	}

	render() {
		var players = this.state.players.map(x => {
			return <li key={x}>{x}</li>
		})

		return (
			<div>
				{players}
			</div>
		)
	}
}

export default Graph;