import React from 'react';
import { Menu } from 'semantic-ui-react'
import './Header.css'

function Header() {
	return (
		<div id="the_header">
			<Menu>
				<Menu.Item header>ATP Visualizer</Menu.Item>
				<Menu.Item
					name='XXX'
					// active={activeItem === 'aboutUs'}
					// onClick={this.handleItemClick}
				/>
				<Menu.Item
					name='YYY'
					// active={activeItem === 'jobs'}
					// onClick={this.handleItemClick}
				/>
				<Menu.Item
					name='ZZZ'
					// active={activeItem === 'locations'}
					// onClick={this.handleItemClick}
				/>
			</Menu>
		</div>
	)
}

export default Header;