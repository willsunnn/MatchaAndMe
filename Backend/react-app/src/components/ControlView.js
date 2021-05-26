import React from 'react';
import styles from '../css/dataview.module.css';
import Switch from "react-switch";

class ControlView extends React.PureComponent {
	// construct with data props
	// data is an array of observation objects

	constructor() {
		super();
		this.state = {auto_toggle_is_checked:false};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(checked) {
		this.setState({auto_toggle_is_checked: checked});
		console.log(this.state);
	}

	render() {
		return (
			<label>
				<span>Switch with default style</span>
				<Switch onChange={this.handleChange} checked={this.state.auto_toggle_is_checked} />
				<p></p>
			</label>
		)
	}
}

export default ControlView;