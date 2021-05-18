import React from 'react';
import PlantView from '../components/PlantView';
import get_plant_list from '../API';

class PlantViewPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			plant: null
		};
	}

	handle_request(plant_data) {
	}

	render() {
		return (<div><p>PlantView Page</p></div>)
	}
}

export default PlantViewPage;