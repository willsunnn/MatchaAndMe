import React from 'react';
import PlantView from '../components/PlantView';


function get_plant(id, handler) {
	const Http = new XMLHttpRequest();
	const url = '/get-plant/'+id;
	Http.onreadystatechange = function() {
		if(this.readyState==4 && this.status==200) {
			handler(Http.responseText);
		}
	}
	Http.open("GET", url, true);
	Http.send();
}

class PlantViewPage extends React.Component {

	constructor(props) {
		super(props);

		const link = window.location.href;
		const id = link.split('/').pop();

		this.state = {
			plant: null,
			id: id
		};

		this.handle_request = this.handle_request.bind(this);
		get_plant(this.state.id, this.handle_request);
	}

	handle_request(plant_data) {
		const parsed = JSON.parse(plant_data);
		this.setState({plant: parsed});

		console.log(this.state);
	}

	render() {
		return (
		<div>
			<p>PlantView Page</p>
			<PlantView plant={this.state.plant} />
		</div>)
	}
}

export default PlantViewPage;