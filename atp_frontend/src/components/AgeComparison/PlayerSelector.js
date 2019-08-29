import React, {useEffect, useState} from 'react';
import { Dropdown } from 'semantic-ui-react'
import faker from 'faker'
import './styles/PlayerSelector.css'

class PlayerSelector extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			players: []
		}
	}

	convert_data(data) {
		const arr = []
		for (var i = 0; i < data.length; i++) {
			let d = data[i]
			arr.push({text: d['last_name'].concat(", ", d['first_name']), value: d['id'], key: d['id']})
		}
		return arr
	}

	componentDidMount() {
		fetch("/topTenPlayers").then(response => 
			response.json().then(data => {
				this.setState({
					players: this.convert_data(data['data'])
				})
		}))
	}



	search_change(data) {
		const filter = data['searchQuery']
		if (filter.length == 0) {
			fetch("/topTenPlayers").then(response => 
			response.json().then(data => {
				console.log(data)
				this.setState({
					players: this.convert_data(data['data'])
				})
			}))
		}
		else {
			fetch(`/topTenFiltered?prefix=${filter}`).then(response =>
			response.json().then(data => {
				console.log(data)
				this.setState({
					players: this.convert_data(data['data'])
				})
			}))
		}
	}

	label_click(data) {
		var player_name = null;
		var player_id = data['value']
		for (var i = 0; i < data['options'].length; i++) {
			if (data['options'][i]['value'] == player_id) {
				player_name = data['options'][i]['text']
			}
		}
		this.props.added_player_handler(player_id, player_name)
	}

	render() {
		const friendOptions = [
		  {
		    key: 'Jenny Hess',
		    text: 'Jenny Hess',
		    value: 'Jenny Hess',
		  },
		  {
		    key: 'Elliot Fu',
		    text: 'Elliot Fu',
		    value: 'Elliot Fu',
		  }
		]
		return (
			<div id="the_player_selector">
				<Dropdown
					placeholder='Select a Player'
					search
					selection
					onChange={(_, data) => this.label_click(data)}
					onSearchChange={(_, data) => this.search_change(data)}
					options={this.state.players}
				/>
			</div>
		)
	}
}

export default PlayerSelector;