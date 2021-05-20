import React from 'react';
import PlantView from '../components/PlantView';
import get_plant from '../API';

class PlantViewPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			plant: null
		};
		const id = 1;

		this.handle_request = this.handle_request.bind(this);
		get_plant(id, this.handle_request);
	}

	handle_request(plant_data) {
		const parsed = JSON.parse(plant_data);
		this.setState({plant: parsed});
	}

	render() {
		return (
		<div>
			<p>PlantView Page</p>
			<PlantView plant={this.state.plant} PlantView/>
		</div>)
	}
}

export default PlantViewPage;