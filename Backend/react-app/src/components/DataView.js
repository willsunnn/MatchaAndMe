import React from 'react';
import { withStyles } from "@material-ui/core";

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center",
		"margin": "20px"
	},
	table: {
		"border": "1px solid black"
	}
});

function get_data(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-data/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

class DataView extends React.PureComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			id: props.plant_id,
			data: []
		};

		// asynchronously fetch data points
		this.handle_data_request = this.handle_data_request.bind(this);
		get_data(this.state.id, this.handle_data_request);

	}

	handle_data_request(data) {
		const parsed = JSON.parse(data);
		this.setState({data: parsed});
	}


	// construct with data props
	// data is an array of observation objects

	convertDateTime(utc_datetime) {
		var date = new Date(utc_datetime+'Z');
		return date.toString();
	}

	render() {
		const { classes } = this.props;
		return (
		<div className={classes.parentDiv}>
		<table className={classes.table}>	
			<tr>
				<th>Date and Time</th>
				<th>Temperature (deg F)</th>
				<th>Humidity (%)</th>
				<th>Light Level (%)</th>
				<th>Soil Moisture (%)</th>
			</tr>
			{
				this.state.data.map(
					data => 
					<tr>
						<td>{this.convertDateTime(data.datetime)}</td>
						<td>{data.temp}</td>
						<td>{data.humidity}</td>
						<td>{data.light}</td>
						<td>{data.soil_moisture}</td>
					</tr>	
				)
			}
		</table>
		</div>)
	}
}

export default withStyles(styles, { withTheme: true })(DataView);