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

class DataView extends React.PureComponent {
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
				this.props.data.map(
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