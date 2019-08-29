import React from 'react';
import { Button } from 'semantic-ui-react'
import './styles/CurrentPlayers.css'

class CurrentPlayers extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			players: []
		}
	}

	addPlayer(id, name, color) {
		if (this.state.players.map(x => x['id']).includes(id)) {
			return
		}
		this.setState({
			players: [...this.state.players, {id: id, name:name, color:color}]
		})
	}

	handle_button_click(data) {
		this.setState({
			players: this.state.players.filter(x => x['id'] !== data['id'])
		})
		this.props.removed_player_handler(data['id'])
	}

	render() {
		const players = this.state.players.map((player) => {
			return (
				<div id="the_current_player" key={player['id']}>
					<Button className="player_button" style={{backgroundColor: player['color'], borderRadius: 0}} id={player['id']} onClick={(e, data) => this.handle_button_click(data)}>{player['name']}</Button>
					<br></br>
					<br></br>
				</div>
			)
		})

		return (
			<div id="the_current_players">
				{players}
			</div>
		)
	}
}

export default CurrentPlayers;