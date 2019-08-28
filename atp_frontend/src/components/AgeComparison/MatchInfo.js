import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import { AutoSizer, Column, Table } from 'react-virtualized';
import './styles/MatchInfo.css'


class MatchInfo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			match_data: []
		}
	}

	set_match_data(data) {
		this.setState({
			match_data: data
		})
	}

	render() {
		const rows = this.state.match_data.map(tourney => (
			tourney['matches'].map(match => (
				<TableRow key={tourney['name'] + match['winner']['first_name'] + match['winner']['last_name'] + match['loser']['first_name'] + match['loser']['last_name']}>
					<TableCell align="left">{tourney['name']}</TableCell>
					<TableCell align="left">{match['round']}</TableCell>
					<TableCell align="left">{match['winner']['first_name'] + " " + match['winner']['last_name']}</TableCell>
					<TableCell align="left">{match['loser']['first_name'] + " " + match['loser']['last_name']}</TableCell>
					<TableCell align="left">{match['score']}</TableCell>
				</TableRow>
			))
		))

		return (
			<div id="the_table">
				<Paper id= "the_paper">
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell align="left">Tournament</TableCell>
								<TableCell align="left">Round</TableCell>
								<TableCell align="left">Winner</TableCell>
								<TableCell align="left">Loser</TableCell>
								<TableCell align="left">Score</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows}
						</TableBody>
					</Table>
				</Paper>
			</div>	
		)
	}

	render3() {
		const tables = this.state.match_data.map(tourney => {
			return (
				<Table key={tourney['name']} size='small'>
					<TableHead>
						<TableRow>
							<TableCell align="left">Tournament</TableCell>
							<TableCell align="left">Round</TableCell>
							<TableCell align="left">Winner</TableCell>
							<TableCell align="left">Loser</TableCell>
							<TableCell align="left">Score</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
					{
						tourney['matches'].map(match => (
							<TableRow key={match['winner']['first_name'] + match['winner']['last_name'] + match['loser']['first_name'] + match['loser']['last_name']}>
								<TableCell align="left">{tourney['name']}</TableCell>
								<TableCell align="left">{match['round']}</TableCell>
								<TableCell align="left">{match['winner']['first_name'] + match['winner']['last_name']}</TableCell>
								<TableCell align="left">{match['loser']['first_name'] + match['loser']['last_name']}</TableCell>
								<TableCell align="left">{match['score']}</TableCell>
							</TableRow>
						))
					}
					</TableBody>
				</Table>
			)
		})

		return (
			<div id="the_table">
				<Paper>
					{tables}
				</Paper>
			</div>
		)
	}

	render2() {

		function createData(name, calories, fat, carbs, protein) {
			return { name, calories, fat, carbs, protein };
		}

		const rows = [
			createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
			createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
			createData('Eclair', 262, 16.0, 24, 6.0),
			createData('Cupcake', 305, 3.7, 67, 4.3),
			createData('Gingerbread', 356, 16.0, 49, 3.9),
		];

		return (
			<div id="the_table">
				<Paper >
					<Table >
						<TableHead>
							<TableRow>
								<TableCell>Dessert (100g serving)</TableCell>
								<TableCell align="right">Calories</TableCell>
								<TableCell align="right">Fat&nbsp;(g)</TableCell>
								<TableCell align="right">Carbs&nbsp;(g)</TableCell>
								<TableCell align="right">Protein&nbsp;(g)</TableCell>
							</TableRow>
					</TableHead>
					<TableBody>
					{rows.map(row => (
					<TableRow key={row.name}>
					<TableCell component="th" scope="row">
					{row.name}
					</TableCell>
					<TableCell align="right">{row.calories}</TableCell>
					<TableCell align="right">{row.fat}</TableCell>
					<TableCell align="right">{row.carbs}</TableCell>
					<TableCell align="right">{row.protein}</TableCell>
					</TableRow>
					))}
					</TableBody>
					</Table>
				</Paper>
			</div>
		)
	}
}


export default MatchInfo;

