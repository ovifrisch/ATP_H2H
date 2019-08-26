import React from 'react';
import { Button } from 'semantic-ui-react'

class CurrentPlayers extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			players: []
		}
	}

	addPlayer(id, name) {
		if (this.state.players.map(x => x['id']).includes(id)) {
			return
		}
		this.setState({
			players: [...this.state.players, {id: id, name:name}]
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			players: nextProps.players
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
				<Button id={player['id']} key={player['id']} onClick={(e, data) => this.handle_button_click(data)}>{player['name']}</Button>
			)
		})

		return (
			<div>
				{players}
			</div>
		)
	}
}

export default CurrentPlayers;