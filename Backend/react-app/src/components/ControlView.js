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
				valve_remaining_time: 0.0,
				valve_auto_value: 0.0
			},
		};

		// bind LED Control UI handlers
		this.openLedControl = this.openLedControl.bind(this);
		this.closeLedControl = this.closeLedControl.bind(this);
		this.handleLEDToggleChange = this.handleLEDToggleChange.bind(this);

		// bind Valve Control UI handlers
		this.openValveControl = this.openValveControl.bind(this);
		this.closeValveControl = this.closeValveControl.bind(this);

		// asynchronously fetch control scheme change
		this.handleControlSchemeResponse = this.handleControlSchemeResponse.bind(this);
		get_control_scheme(this.state.current_control_scheme.plant_id, this.handleControlSchemeResponse);
	}

	// Asynchronous Request handling
	handleControlSchemeResponse(control) {
		const parsed = JSON.parse(control);
		console.log(parsed);
		this.setState({current_control_scheme: parsed});
	}

	// LED Control functions
	openLedControl() {
		this.setState({led_control_is_open: true});
	}

	closeLedControl() {
		this.setState({led_control_is_open: false});
	}

	handleLEDToggleChange(checked) {
		set_led_status(this.state.current_control_scheme.plant_id, checked, this.handleControlSchemeResponse)
	}

	// Valve Control functions
	openValveControl() {
		this.setState({valve_control_is_open: true});
	}

	closeValveControl() {
		this.setState({valve_control_is_open: false});
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

					{/*This button and dialog are for the LED control*/}
					<Button variant="outlined" color="primary" onClick={this.openLedControl} className={classes.ledControlButton}>
						Open LED Control
					</Button>
					<Dialog open={this.state.led_control_is_open} onClose={this.closeLedControl} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">LED Control</DialogTitle>
						<DialogContent>
							<DialogContentText>
								Turn the LED {this.state.current_control_scheme.led_is_on? "off" : "on"} by flipping the toggle
							</DialogContentText>
							<Switch onChange={this.handleLEDToggleChange} checked={this.state.current_control_scheme.led_is_on} />
						</DialogContent>
						<DialogActions>
							<Button onClick={this.closeLedControl} color="primary">
								Done
							</Button>
						</DialogActions>
					</Dialog>

					{/*This button and dialog are for the valve control*/}
					<Button variant="outlined" color="primary" onClick={this.openValveControl} className={classes.valveControlButton}>
						Open Valve Control
					</Button>
					<Dialog open={this.state.valve_control_is_open} onClose={this.closeValveControl} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">Valve Control</DialogTitle>
						<DialogContent>
						<DialogContentText>
							VALVE CONTROL TEXT
						</DialogContentText>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.closeValveControl} color="primary">
								Done
							</Button>
						</DialogActions>
					</Dialog>
				</CardContent>
			</Card>
			</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(ControlView);