import React from 'react';
import {Line} from 'react-chartjs-2';

class Graph extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			datasets: [],
			labels: []
		}
	}

	create_dataset(ranks, id) {
		return {
			label: id.toString(),
			fill: false,
			lineTension: 0.1,
			backgroundColor: 'rgba(75,192,192,0.4)',
			borderColor: 'rgba(75,192,192,1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(75,192,192,1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 1,
			pointHoverRadius: 5,
			pointHoverBackgroundColor: 'rgba(75,192,192,1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
			pointHoverBorderWidth: 2,
			pointRadius: 1,
			pointHitRadius: 10,
			data: ranks
		}
	}

	addPlayer(player_id) {

		fetch(`/get_ranking_history?player_id=${player_id}&starting_age=25&ending_age=26`).then(response =>
			response.json().then(data => {
				var ranks = data['data'].map(x => x['rank'])
				this.setState({
					labels: data['data'].map(x => x['age']),
					datasets: [...this.state.datasets, this.create_dataset(ranks, player_id)]
				})
			}))
	}

	render() {

		const data = {
			labels: this.state.labels,
			datasets: this.state.datasets
		};



		return (
			<div>
				<Line data={data} />
			</div>
		)
	}
}

export default Graph;