import React from 'react';
import { Slider } from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';

class AgeSlider extends React.Component {
	constructor(props) {
		super(props)
	}

	slider_change(e, val) {
		this.props.slider_handler(val)
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


		const AirbnbSlider = withStyles({
			root: {
				color: '#3a8589',
				height: 3,
				padding: '13px 0',
			},
			thumb: {
				height: 27,
				width: 27,
				backgroundColor: '#fff',
				border: '1px solid currentColor',
				marginTop: -12,
				marginLeft: -13,
				boxShadow: '#ebebeb 0px 2px 2px',
				'&:focus,&:hover,&$active': {
				  boxShadow: '#ccc 0px 2px 3px 1px',
			},
			'& .bar': {
				// display: inline-block !important;
				height: 9,
				width: 1,
				backgroundColor: 'currentColor',
				marginLeft: 1,
				marginRight: 1,
			},
			},
			active: {},
			valueLabel: {
				left: 'calc(-50% + 4px)',
			},
			track: {
				height: 3,
			},
			rail: {
				color: '#d8d8d8',
				opacity: 1,
				height: 3,
			},
		})(Slider);

		return (
			<div>
			<AirbnbSlider
				ThumbComponent={AirbnbThumbComponent}
				aria-label="airbnb slider"
				defaultValue={[20, 30]}
				valueLabelDisplay="on"
				onChangeCommitted={(e, val) => this.slider_change(e, val)}
			/>
			</div>
		)
	}
}

export default AgeSlider;