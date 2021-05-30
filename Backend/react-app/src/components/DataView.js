import React from 'react';
import { withStyles, Typography } from "@material-ui/core";
import { ResponsiveLine } from '@nivo/line'
import Button from '@material-ui/core/Button';

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center",
		"margin": "20px",
		"height": "500px"
	},
	table: {
		"border": "1px solid black"
	}
});

function get_data(id, date, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-data/' + id;
	Http.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
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
			data: [],
			loaded: false,
			date: new Date()
		};

		this.translate_data_format = this.translate_data_format.bind(this);
		this.get_next_day = this.get_next_day.bind(this);
		this.get_prev_day = this.get_prev_day.bind(this);

		// asynchronously fetch data points
		this.handle_data_request = this.handle_data_request.bind(this);
		get_data(this.state.id, this.state.date, this.handle_data_request);
	}

	handle_data_request(data) {
		const parsed = JSON.parse(data);
		this.setState({ data: this.translate_data_format(parsed), loaded: true});
	}

	get_next_day() {
		var d = this.state.date;
		d.setDate(d.getDate() + 1);
		this.setState({date: new Date(d.getTime())});		// creates a copy of date
	}

	get_prev_day() {
		var d = this.state.date;
		d.setDate(d.getDate() - 1);
		this.setState({date: new Date(d.getTime())});		// creates a copy of date
	}

	// given a JSON array, reorganize the array to the required format for nivo Line Graph
	translate_data_format(data) {

		// skips some values of data as there are too many
		const num_data_points = 200;
		const num_to_skip = Math.max(Math.floor(data.length / num_data_points),1);
		var new_data = []
		for(var i=0; i<data.length; i++) {
			if(i%num_to_skip == 0) {
				new_data.push(data[i]);
			}
		}
		data = new_data;

		// convert the format from list of observations to the format required
		// by Responsive Line
		var soil = {id: "Soil Moisture"}
		var lightLevel = {id: "Light Level"}
		var humidity = {id: "Humidity"}
		var temperature = {id: "Temperature"}

		var soil_data = []
		var light_data = []
		var humidity_data = []
		var temp_data = []

		for(var i = 0; i < data.length; i++) {
			var data_point = data[i];

			var dt = this.convertDateTime(data_point.datetime)
			humidity_data.push({x: dt, y: data_point.humidity})
			light_data.push({x: dt, y: data_point.light})
			soil_data.push({x: dt, y: data_point.soil_moisture})
			temp_data.push({x: dt, y: data_point.temp})

		}
		soil.data = soil_data
		lightLevel.data = light_data
		humidity.data = humidity_data
		temperature.data = temp_data

		var array = [soil, lightLevel, humidity, temperature]
		return array
	}

	get_x_grid_values()
	{
		if (this.state.loaded)
		{
			var first = this.state.data[0]['data'][0]['x']
			var lastData = this.state.data[0]['data']
			var last = lastData[lastData.length-1]['x']
			return [first, last]
		}
		else { return [0,1] }
	}

	// construct with data props
	// data is an array of observation objects

	convertDateTime(utc_datetime) {
		var date = new Date(utc_datetime + 'Z');
		return date.toString();
	}

	render() {
		const { classes } = this.props;
		return (
			<div>
				<div>
					<Typography variant="h6">
						{this.state.date.toUTCString()}
					</Typography>
				</div>
				<div className={classes.parentDiv}>
					{(this.state.data.length > 0) ? this.render_graph() : ""}
				</div>
				<div>
					<Button onClick={this.get_prev_day} color="secondary">
						Show Previous Day
					</Button>
					<Button onClick={this.get_next_day} color="secondary">
						Show Next Day
					</Button>
				</div>
			</div>)
	}

	render_graph() {
		var firstLast = this.get_x_grid_values()

		return (
			<ResponsiveLine
				data={this.state.data}
				margin={{ top: 50, right: 110, bottom: 50, left: 110 }}
				xScale={{ type: 'point' }}
				yScale={{ type: 'linear', min: '0', max: '100', stacked: false, reverse: false }}
				yFormat=" >-.2f"
				axisTop={null}
				axisRight={{
						orient: 'right',
						tickSize: 5,
						tickValues: [0, 25, 50, 75, 100, 125],
						tickPadding: 5,
						tickRotation: 0,
						legend: 'Degrees (Fahrenheit)',
						legendOffset: 36,
						legendPosition: 'middle'
				}}
				axisBottom={{
					orient: 'bottom',
					tickSize: 5,
					tickValues: firstLast,
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Time',
					legendOffset: 36,
					legendPosition: 'middle'
				}}
				axisLeft={{
					orient: 'left',
					tickSize: 5,
					tickValues: [0, 25, 50, 75, 100],
					tickPadding: 5,
					tickRotation: 0,
					legend: 'Percentage',
					legendOffset: -40,
					legendPosition: 'middle'
				}}
				pointSize={4}
				pointColor={{ theme: 'background' }}
				pointBorderWidth={2}
				pointBorderColor={{ from: 'serieColor' }}
				pointLabelYOffset={-12}
				areaOpacity={0.3}
				useMesh={true}
				legends={[
					{
						anchor: 'bottom-left',
						direction: 'column',
						justify: false,
						translateX: -100,
						translateY: 0,
						itemsSpacing: 0,
						itemDirection: 'left-to-right',
						itemWidth: 80,
						itemHeight: 20,
						itemOpacity: 0.75,
						symbolSize: 12,
						symbolShape: 'circle',
						symbolBorderColor: 'rgba(0, 0, 0, .5)',
						effects: [
							{
								on: 'hover',
								style: {
									itemBackground: 'rgba(0, 0, 0, .03)',
									itemOpacity: 1
								}
							}
						]
					}
				]}
			/>
		)
	}
}

export default withStyles(styles, { withTheme: true })(DataView);