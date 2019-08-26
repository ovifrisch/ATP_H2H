import React from 'react';
import {Line} from 'react-chartjs-2';

class Graph extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			datasets: [],
			labels: [],
			start_age: 20,
			end_age: 30
		}
	}

	static colors = [
		'rgb(76, 128, 24, 1)',
		'rgb(24, 76, 128, 1)',
		'rgb(128, 24, 128, 1)',
		'rgb(216, 12, 12, 1)',
		'rgb(225, 122, 19, 1)',
		'rgb(19, 225, 225, 1)',
		'rgb(68, 97, 39, 1)',
		'rgb(97, 39, 39, 1)'
	]

	generate_color() {
		var o = Math.round, r = Math.random, s = 255;
		return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + 1 + ')';
	}

	create_dataset(ranks, player_name, player_id, color_idx) {
		var color;
		if (color_idx < 8) {
			color = Graph.colors[color_idx]
		}
		else{
			color = this.generate_color()
		}
		var res =
		{
			data: {
				label: player_name,
				fill: false,
				lineTension: 0.1,
				backgroundColor: color,
				borderColor: color,
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: color,
				pointBackgroundColor: '#fff',
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: color,
				pointHoverBorderColor: 'rgba(220,220,220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: ranks,
			},

			player_id: player_id,
			player_name: player_name
		}

		return res
	}

	// http GET to flask api to fetch ranking history of player with id=p_id between ages of s and e
	fetch_ranking_history(p_id, s, e) {
		var endpt = `/get_ranking_history?player_id=${p_id}&starting_age=${s}&ending_age=${e}`
		return fetch(endpt)
	}

	changeAgeRange(start, end) {
		// if any part of the interval of the new range is in the old range,
		// then we don't necessarily need to refetch this data. but for now
		// to keep things simple, just refetch everything
		var player_ids = this.state.datasets.map(x => x['player_id'])
		var player_names = this.state.datasets.map(x => x['player_name'])
		var new_labels = [];
		var new_datasets = [];

		const request = async(idx) => {
			if (idx >= player_ids.length) {
				this.setState({
					datasets: new_datasets,
					labels: new_labels,
					start_age: start,
					end_age: end
				})
				return
			}
			var endpt = `/get_ranking_history?player_id=${player_ids[idx]}&starting_age=${start}&ending_age=${end}`
			const response = await fetch(endpt);
			const data = await response.json();
			var ranks = data['data'].map(x => x['rank'])
			var labels = data['data'].map(x => x['age'])
			if (labels.length > new_labels.length) {
				new_labels = labels
			}
			new_datasets.push(this.create_dataset(ranks, player_names[idx], player_ids[idx], idx))
			console.log(new_datasets.length)
			request(idx + 1)
		}

		request(0)
	}

	addPlayer(player_id, player_name) {

		var promise = this.fetch_ranking_history(player_id, this.state.start_age, this.state.end_age)
		promise.then(response => response.json().then(data => {
			var ranks = data['data'].map(x => x['rank'])
			var new_labels = data['data'].map(x => x['age'])
			if (new_labels.length < this.state.labels.length) {
				new_labels = this.state.labels
			}
			this.setState({
				labels: new_labels,
				datasets: [...this.state.datasets, this.create_dataset(ranks, player_name, player_id, this.state.datasets.length)]
			})
		}))
	}

	render() {

		const datasets = this.state.datasets.map(x => x['data'])

		const data = {
			labels: this.state.labels,
			datasets: datasets
		};



		return (
			<div>
				<Line data={data} />
			</div>
		)
	}
}

export default Graph;