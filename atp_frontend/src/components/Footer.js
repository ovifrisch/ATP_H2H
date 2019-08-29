import React from 'react';
import { Menu } from 'semantic-ui-react'
import './Footer.css'

function Footer() {
	return (
		<div id="the_footer">
			<Menu>
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

export default Footer;