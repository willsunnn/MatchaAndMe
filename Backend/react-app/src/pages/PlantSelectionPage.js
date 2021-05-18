import React from 'react';
import PlantView from '../components/PlantView';
import get_plant_list from '../API';

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
		console.log(this.state.plants)
		return (
		<div>
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