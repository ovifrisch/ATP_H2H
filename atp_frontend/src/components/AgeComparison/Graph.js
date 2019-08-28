import React from 'react';
import {Line} from 'react-chartjs-2';

class Graph extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			datasets: [],
			labels: this.get_labels(20, 30),
			start_age: 20,
			end_age: 30,
			available_colors: Graph.colors
		}
	}

	get_labels(start_yr, end_yr) {
		if (start_yr >= end_yr) {
			return []
		}
		var start = start_yr + (1/96)
		var labels = []
		while (start <= end_yr) {
			labels.push(start)
			start = start + (1/96)
		}
		return labels
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

	create_dataset(ranks, dates, player_name, player_id, color) {
		var res =
		{
			data: {
				my_id: player_id,
				label: player_name,
				spanGaps: true,
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
			dates: dates,
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

	// http GET to flask api to fetch significant matches for this player at this age
	fetch_significant_matches(p_id, date1, date2) {

		// const sub_weeks = (date, N) => {
		// 	if (N == 0) {
		// 		return date
		// 	}

		// 	var year = date['yr']
		// 	var mo = date['mo']
		// 	var day = date['day']

		// 	if (day - 7 >= 1) {
		// 		day = day - 7
		// 		return sub_weeks({'yr': year, 'mo':mo, 'day':day}, N - 1)
		// 	}

		// 	day = 30 - (7 - day)
		// 	mo -= 1
		// 	if (mo == 2 && day >= 29) {
		// 		day = 28
		// 	}

		// 	if (mo == 0) {
		// 		mo = 12
		// 		year -= 1
		// 	}

		// 	return sub_weeks({'yr': year, 'mo':mo, 'day':day}, N - 1)
		// }

		const date_str = (date) => {
			var mo;
			var day;
			var yr = date['yr']
			if (date['mo'] < 10) {
				mo = "0" + date['mo'].toString()
			} else{
				mo = date['mo'].toString()
			}
			if (date['day'] < 10){
				day = "0" + date['day'].toString()
			} else {
				day = date['day'].toString()
			}
			var res = yr + mo + day
			return res
		}

		date1 = date_str(date1)
		date2 = date_str(date2)
		var endpt = `/get_significant_matches?player_id=${p_id}&date1=${date1}&date2=${date2}`
		return fetch(endpt)
	}

	changeAgeRange(val, min_max) {
		// if any part of the interval of the new range is in the old range,
		// then we don't necessarily need to refetch this data. but for now
		// to keep things simple, just refetch everything
		var old_colors = this.state.datasets.map(x => x['data']['backgroundColor'])
		var player_ids = this.state.datasets.map(x => x['player_id'])
		var player_names = this.state.datasets.map(x => x['player_name'])
		var new_datasets = [];
		var start = this.state.start_age
		var end = this.state.end_age
		if (min_max == "max") {
			end = val
		} else {
			start = val
		}
		var new_labels = this.get_labels(start, end)

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
			console.log(data)
			var dates = data['data'].map(x => x['date'])
			var ranks = data['data'].map(x => x['rank'])
			var labels = data['data'].map(x => x['age'])
			var values = this.pad_ranks(ranks, dates, labels, start, end)
			var padded_ranks = values[0]
			var padded_dates = values[1]
			var new_dataset = this.create_dataset(padded_ranks, padded_dates, player_names[idx], player_ids[idx], old_colors[idx])
			new_datasets.push(new_dataset)
			request(idx + 1)
		}

		request(0)
	}

	removePlayer(player_id) {
		var new_available_colors = this.state.available_colors;
		for (var i = 0; i < this.state.datasets.length; i++) {
			if (this.state.datasets[i]['player_id'] === player_id) {
				new_available_colors.unshift(this.state.datasets[i]['data']['backgroundColor'])
			}
		}

		this.setState({
			datasets: this.state.datasets.filter(x => x['player_id'] !== player_id),
			available_colors: new_available_colors
		})
	}

	get_color() {
		var color;
		if (this.state.available_colors.length == 0) {
			return this.generate_color()
		}
		return this.state.available_colors[0]
	}

	pad_ranks(ranks, dates, labels, start, end) {
		var new_ranks = Array(Math.max(end - start, 0) * 96).fill(null)
		var new_dates = Array(Math.max(end - start, 0) * 96).fill(null)
		for (var i = 0; i < labels.length; i++) {
			if (labels[i] < start || labels[i] > end) {
				continue
			}
			var idx = Math.floor((labels[i] - start) / (1/96))
			new_dates[idx] = dates[i]
			if (new_ranks[idx] === null) {
				new_ranks[idx] = ranks[i]
			} else {
				new_ranks[idx] = Math.min(new_ranks[idx], ranks[i])
			}
		}
		return [new_ranks, new_dates]
	}

	addPlayer(player_id, player_name) {

		// first check to see if this player has already been added
		if (this.state.datasets.map(x => x['player_id']).includes(player_id)) {
			return
		}

		var promise = this.fetch_ranking_history(player_id, this.state.start_age, this.state.end_age)
		promise.then(response => response.json().then(data => {
			console.log(data)
			var ranks = data['data'].map(x => x['rank'])
			var dates = data['data'].map(x => x['date'])
			var labels = data['data'].map(x => x['age'])
			var values = this.pad_ranks(ranks, dates, labels, this.state.start_age, this.state.end_age)
			var padded_ranks = values[0]
			var padded_dates = values[1]
			var color = this.get_color()
			var new_dataset = this.create_dataset(padded_ranks, padded_dates, player_name, player_id, color)
			this.setState({
				datasets: [...this.state.datasets, new_dataset],
				available_colors: this.state.available_colors.slice(1)
			})
		}))
	}

	handle_hover(e, data) {
		if (data.length == 0) {
			return
		}
		var hover_y = e['layerY']
		var others = data.map(x => [x['_model']['y']])
		
		// now find the index in others that hover_x, hover_y is closest to
		var min_idx = 0
		var min_dist = Math.abs(hover_y - others[0])
		for (var i = 0; i < others.length; i++) {
			var dist = Math.abs(hover_y - others[i])
			if (dist < min_dist) {
				min_idx = i;
				min_dist = dist
			}
		}

		// now get the rgb value at this index
		var clr = data[min_idx]['_options']['borderColor']
		// now find the dataset index that has this color
		var target_dataset;
		var dset;
		for (dset of this.state.datasets) {
			if (dset['data']['borderColor'] == clr) {
				target_dataset = dset
				break
			}
		}

		var player_id = target_dataset['player_id']
		var player_name = target_dataset['player_name']
		var idx = data[0]['_index']
		var right_date = target_dataset['dates'][idx]
		// get the previous two dates
		var left_date = null;
		idx -= 1;
		while (idx >= 0) {
			left_date = target_dataset['dates'][idx]
			if (left_date !== null) {
				break
			}
			idx -= 1
		}
		if (left_date === null) {
			return
		}
		var promise = this.fetch_significant_matches(player_id, left_date, right_date)
		promise.then(response => response.json().then(data => {
			console.log(data)
		}))
	}

	render() {

		const datasets = this.state.datasets.map(x => x['data'])

		var max_ticks;
		var diff = this.state.end_age - this.state.start_age
		if (diff > 5) {
			max_ticks = Math.floor(diff)
		} else {
			max_ticks = 10
		}

		const options = {
			scales: {
				yAxes: [{
					scaleLabel: {
						labelString: "Ranking",
						display: true
					}
				}],
				xAxes: [{
					scaleLabel: {
						labelString: "Age",
						display: true
					},
					ticks: {
						maxTicksLimit: max_ticks,
						autoSkip: true,
						callback: function(value, index, values) {

							var get_month = (val) => {
								val = val - Math.floor(val)
								return Math.ceil(12 * val)
							}

							if (diff > 5) {
								return Math.floor(value).toString()
							} else {
								var mo = get_month(value)
								if (mo == 0) {
									return Math.floor(value).toString()
								} else {
									return Math.floor(value).toString() + "." + mo.toString()
								}
							}
						}
					}
				}]
			},

			tooltips: {
				mode: 'nearest'
			},

			onHover: (e, data) => this.handle_hover(e, data)
		}

		const data = {
			labels: this.state.labels,
			datasets: datasets
		};

		return (
			<div>
				<Line
					data={data}
					options={options}
				/>
			</div>
		)
	}
}

export default Graph;