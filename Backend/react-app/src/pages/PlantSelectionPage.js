import React from 'react';
import NavBarView from '../components/NavBar';
import PlantView from '../components/PlantView';
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
	title: {
		"color": 'black',
		"text-align": 'center',
		"margin-top": "20px",
		"margin-left": "20px",
		"margin-right": "20px"
	},
	card: {
		"margin": "0 auto"
	}
});

function get_plant_list(handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plants';
	Http.onreadystatechange = function() {
		if(this.readyState===4 && this.status===200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

class PlantSelectionPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			plants: []
		};

		this.handle_request = this.handle_request.bind(this);
		get_plant_list(this.handle_request);
	}

	handle_request(plant_list) {
		const parsed = JSON.parse(plant_list);
		this.setState({plants : parsed});
	}

	render() {
		const { classes } = this.props;
		return (
		<div>
			<NavBarView title="Select a Plant"/>
			<Typography variant="h4" className={classes.title}>
				Plant View Page
			</Typography>
			{
				this.state.plants.map(
					p => <PlantView plant={p} className={classes.card}/>)
			}
		</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(PlantSelectionPage);