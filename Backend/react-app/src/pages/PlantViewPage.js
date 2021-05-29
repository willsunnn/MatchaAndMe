import React from 'react';
import NavBarView from '../components/NavBar';
import PlantView from '../components/PlantView';
import DataView from '../components/DataView';
import ControlView from '../components/ControlView';
import { withStyles } from "@material-ui/core";

function get_plant(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plant/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

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

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center"
	},
	leftColumn: {
		"float": "left",
		"width":"33%"
	},
	rightColumn: {
		"float": "right",
		"width":"66%"
	},
	
});

class PlantViewPage extends React.Component {

	constructor(props) {
		super(props);

		const link = window.location.href;
		const id = link.split('/').pop();

		this.state = {
			plant: null,
			data: [],
			id: id
		};

		// asynchronously fetch plant name
		this.handle_plant_request = this.handle_plant_request.bind(this);
		get_plant(this.state.id, this.handle_plant_request);

		// asynchronously fetch data points
		this.handle_data_request = this.handle_data_request.bind(this);
		get_data(this.state.id, this.handle_data_request);
	}

	handle_plant_request(plant_data) {
		const parsed = JSON.parse(plant_data);
		this.setState({plant: parsed});
	}

	handle_data_request(data) {
		const parsed = JSON.parse(data);
		this.setState({data: parsed});
	}

	get_plant_name() {
		if(this.state.plant == null) {
			return ""
		} else {
			return this.state.plant.name
		}
	}
 
	render() {
		const { classes } = this.props;
		return (
		<div>
			<NavBarView title={this.get_plant_name()}/>
			<div class="row">
				<div className={classes.leftColumn}>
					<PlantView plant={this.state.plant} />
					<ControlView />
				</div>
				<div className={classes.rightColumn}>
					<DataView data={this.state.data} />
				</div>
			</div>
		</div>)
	}
}

export default withStyles(styles, { withTheme: true })(PlantViewPage);