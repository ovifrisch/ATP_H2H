import React from 'react';
import { Slider } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import './styles/AgeSlider.css'

class AgeSlider extends React.Component {
	constructor(props) {
		super(props)
	}

	max_change(val) {
		this.props.slider_handler(val, "max")
	}

	min_change(val) {
		this.props.slider_handler(val, "min")
	}

	render() {

		function AirbnbThumbComponent(props) {
		return (
					<span {...props}>
						<span className="bar" />
						<span className="bar" />
						<span className="bar" />
					</span>
				);
		}

		const PrettoSlider = withStyles({
			root: {
				color: '#2522e0',
				height: 8,
			},
			thumb: {
				height: 24,
				width: 24,
				backgroundColor: '#fff',
				border: '2px solid currentColor',
				marginTop: -8,
				marginLeft: -12,
				'&:focus,&:hover,&$active': {
					boxShadow: 'inherit',
				},
			},
			active: {},
			valueLabel: {
				left: 'calc(-50% + 4px)',
			},
			track: {
				height: 8,
				borderRadius: 4,
			},
			rail: {
				height: 8,
				borderRadius: 4,
			},
		})(Slider);


		
		return (
			<div id="the_age_slider">
				<PrettoSlider
					valueLabelDisplay="auto"
					aria-label="pretto slider"
					defaultValue={20}
					onChangeCommitted={(e, data) => this.min_change(data)}
					min={10}
					max={50}
				/>
				<PrettoSlider
					valueLabelDisplay="auto"
					aria-label="pretto slider"
					defaultValue={30}
					onChangeCommitted={(e, data) => this.max_change(data)}
					min={10}
					max={50}
				/>
			</div>
		)
	}
}

export default AgeSlider;