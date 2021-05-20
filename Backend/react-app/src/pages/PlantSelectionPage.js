import React from 'react';
import NavBarView from '../components/NavBar';
import PlantView from '../components/PlantView';

function get_plant_list(handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plants';
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
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
		return (
		<div>
			<NavBarView title="Select a Plant"/>
			<h1>PlantView Page</h1>
			{
				this.state.plants.map(
					p => <PlantView plant={p} PlantView/>)
			}
		</div>
		)
	}
}

export default PlantSelectionPage;