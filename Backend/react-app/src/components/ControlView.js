import React from 'react';
import Switch from "react-switch";
import { withStyles, Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center"
	},
	rootCard: {
		"margin": "20px"
	},
	title: {
		"color": 'black',
		"text-align": 'center',
		"margin-left": "20px",
		"margin-right": "20px"
	},
	ledControlButton: {
		"margin-top": "20px"
	},
	valveControlButton: {
		"margin-top": "20px",
		"margin-bottom": "20px"
	},
	buttonToggleDiv: {
		"margin-bottom":"20px"
	}
});

function get_control_scheme(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-control/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

function set_led_status(id, led_is_on, handler) {
	const Http = new XMLHttpRequest();
	const url = '/update-led-control/'+id+"?is_on="+led_is_on;
	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

function update_valve_control(id, is_auto, valve_auto_value, valve_manual_value, valve_manual_duration, handler) {
	const Http = new XMLHttpRequest();
	var requestArgs = {
		'is_auto':is_auto,
		'valve_auto_value':valve_auto_value,
		'valve_manual_value':valve_manual_value,
		'valve_manual_duration':valve_manual_duration
	};
	// line taken from https://stackoverflow.com/questions/8135132/how-to-encode-url-parameters
	const encodeGetParams = p => 
  		Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
	const url = '/update-valve-control/'+id+"?"+encodeGetParams(requestArgs);

	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

function deep_copy(obj) {
	return JSON.parse(JSON.stringify(obj))
}

class ControlView extends React.PureComponent {
	// construct with data props
	// data is an array of observation objects

	constructor(props) {
		super(props);
		this.state = {
			led_control_is_open: false,
			valve_control_is_open: false,
			current_control_scheme: {
				plant_id: this.props.plant_id,
				led_is_on: false,
				valve_is_auto: false,
				valve_manual_value: 0.0,
				valve_manual_duration: 0.0,
				valve_auto_value: 0.0
			},
			prev_control_scheme : null
		};

		// bind LED Control UI handlers
		this.openLedControl = this.openLedControl.bind(this);
		this.closeLedControl = this.closeLedControl.bind(this);
		this.handleLEDToggleChange = this.handleLEDToggleChange.bind(this);
		this.submitLedControl = this.submitLedControl.bind(this);

		// bind Valve Control UI handlers
		this.openValveControl = this.openValveControl.bind(this);
		this.closeValveControl = this.closeValveControl.bind(this);
		this.submitValveControl = this.submitValveControl.bind(this);
		this.handleManualValveChange = this.handleManualValveChange.bind(this);
		this.handleManualDurationChange = this.handleManualDurationChange.bind(this);
		this.handleAutoValveChange = this.handleAutoValveChange.bind(this);
		this.handleValveControlChange = this.handleValveControlChange.bind(this);

		// asynchronously fetch control scheme change
		this.handleControlSchemeResponse = this.handleControlSchemeResponse.bind(this);
		get_control_scheme(this.state.current_control_scheme.plant_id, this.handleControlSchemeResponse);
	}

	// Asynchronous Request handling
	handleControlSchemeResponse(control) {
		const parsed = JSON.parse(control);
		var prev_control = this.state.current_control_scheme
		this.setState({current_control_scheme: Object.assign(prev_control, parsed)});
	}

	// LED Control functions
	openLedControl() {
		this.setState({
			led_control_is_open: true,
			prev_control_scheme: deep_copy(this.state.current_control_scheme)		// this is used to keep track of the current state, in case submit is not clicked
		});		
	}

	closeLedControl() {
		this.setState({
			led_control_is_open: false, 
			current_control_scheme: this.state.prev_control_scheme,
			prev_control_scheme: null
		});
	}

	handleLEDToggleChange(checked) {
		var control = this.state.current_control_scheme
		control.led_is_on = checked;
		this.setState({
			current_control_scheme: deep_copy(control)
		});
	}

	submitLedControl() {
		this.setState({
			led_control_is_open: false, prev_control_scheme: null
		});
		set_led_status(this.state.current_control_scheme.plant_id, this.state.current_control_scheme.led_is_on, this.handleControlSchemeResponse);
	}

	// Valve Control functions
	openValveControl() {
		this.setState({
			valve_control_is_open: true,
			prev_control_scheme: deep_copy(this.state.current_control_scheme)		// this is used to keep track of the current state, in case submit is not clicked
		});
	}

	closeValveControl() {
		this.setState({
			valve_control_is_open: false,
			current_control_scheme: this.state.prev_control_scheme,
			prev_control_scheme: null,
		});
	}

	submitValveControl() {		
		this.setState({
			valve_control_is_open: false, 
			prev_control_scheme: null
		});
		const control = this.state.current_control_scheme;
		update_valve_control(
			control.plant_id, 
			control.valve_is_auto, control.valve_auto_value, control.valve_manual_value, control.valve_manual_duration, 
			this.handleControlSchemeResponse);
	}

	handleManualValveChange(event, newValue) {
		newValue = newValue / 100.0;		// convert from percentage to (0-1)
		var control = this.state.current_control_scheme;
		control.valve_manual_value = newValue;
		this.setState({current_control_scheme: deep_copy(control)});
	}

	handleManualDurationChange(event, newValue) {
		var control = this.state.current_control_scheme;
		control.valve_manual_duration = newValue;
		this.setState({current_control_scheme: deep_copy(control)});
	}

	handleAutoValveChange(event, newValue) {
		newValue = newValue / 100.0;		// convert from percentage to (0-1)
		var control = this.state.current_control_scheme;
		control.valve_auto_value = newValue;
		this.setState({current_control_scheme: deep_copy(control)});
	}

	handleValveControlChange(checked) {
		var control = this.state.current_control_scheme;
		control.valve_is_auto = checked;
		this.setState({current_control_scheme: deep_copy(control)});
	}

	// render function
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.parentDiv}>
			<Card className={classes.rootCard} variant="outlined">
				<CardContent>
					<Typography variant="h6" className={classes.title}>
						Plant Control
					</Typography>
					<div>
					<Button variant="outlined" color="primary" onClick={this.openLedControl} className={classes.ledControlButton}>
						Open LED Control
					</Button>
					</div>
					<div>
					<Button variant="outlined" color="primary" onClick={this.openValveControl} className={classes.valveControlButton}>
						Open Valve Control
					</Button>
					</div>
				</CardContent>
			</Card>

			<Dialog open={this.state.led_control_is_open} onClose={this.closeLedControl} aria-labelledby="form-dialog-title">
				<DialogTitle id="form-dialog-title">LED Control</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Turn the LED {this.state.current_control_scheme.led_is_on? "off" : "on"} by flipping the toggle
					</DialogContentText>
					<Switch onChange={this.handleLEDToggleChange} checked={this.state.current_control_scheme.led_is_on} />
				</DialogContent>
				<DialogActions>
					<Button onClick={this.closeLedControl} color="secondary">
						Cancel
					</Button>
					<Button onClick={this.submitLedControl} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
			
			<Dialog open={this.state.valve_control_is_open} onClose={this.closeValveControl} aria-labelledby="form-dialog-title">
				<DialogTitle>Valve Control</DialogTitle>
				<DialogContent>
					<div className={classes.buttonToggleDiv}>
					<Button onClick={() => this.handleValveControlChange(false)} color="primary">
						Manual
					</Button>
					<Button onClick={() => this.handleValveControlChange(true)} color="primary">
						Automatic
					</Button>
					</div>
					{this.state.current_control_scheme.valve_is_auto ?
						this.renderAutomaticControl() : this.renderManualControl()}
				</DialogContent>
				<DialogActions>
					<Button onClick={this.closeValveControl} color="secondary">
						Cancel
					</Button>
					<Button onClick={this.submitValveControl} color="primary">
						Submit
					</Button>
				</DialogActions>
			</Dialog>
			</div>
		)
	}

	renderManualControl() {
		const value = this.state.current_control_scheme.valve_manual_value;
		const dur = this.state.current_control_scheme.valve_manual_duration;
		return (
		<div>
			<DialogContentText>
				Valve Manual Value
			</DialogContentText>
			<DialogContentText>
				It will set the valve to output water at {Math.round(value * 100)}% strength for {dur} seconds
			</DialogContentText>
			<Slider aria-labelledby="continuous-slider" 
				value={this.state.current_control_scheme.valve_manual_value*100} 
				onChange={this.handleManualValveChange} 
				min={0.0}
				max={100.0}
				marks={[
					{value:0, label:"0%"},
					{value:25, label:"25%"},
					{value:50, label:"50%"},
					{value:75, label:"75%"},
					{value:100, label:"100%"}
				]}/>
			<Slider aria-labelledby="continuous-slider" 
				value={this.state.current_control_scheme.valve_manual_duration} 
				onChange={this.handleManualDurationChange} 
				min={0.0}
				max={300.0}
				marks={[
					{value:10, label:"10 secs"},
					{value:60, label:"1 min"},
					{value:300, label:"5 mins"}
				]}/>
		</div>
		)
	}

	renderAutomaticControl() {
		const value = this.state.current_control_scheme.valve_auto_value;
		return (
		<div>
			<DialogContentText>
				Valve Automatic Value
			</DialogContentText>
			<DialogContentText>
				It will try to keep the soil moisture of the plant above {Math.round(value * 100)}%
			</DialogContentText>
			<Slider aria-labelledby="continuous-slider" 
				value={this.state.current_control_scheme.valve_auto_value*100} 
				onChange={this.handleAutoValveChange} 
				min={0.0}
				max={100.0}
				marks={[
					{value:0, label:"0%"},
					{value:25, label:"25%"},
					{value:50, label:"50%"},
					{value:75, label:"75%"},
					{value:100, label:"100%"}
				]}/>
		</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(ControlView);