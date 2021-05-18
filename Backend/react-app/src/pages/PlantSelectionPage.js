import React from 'react';
import PlantView from '../components/PlantView';

class PlantSelectionPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = props.plants;
	}

	render() {
		return (<div><p>Plant Selection Page</p></div>)
	}
	
	renderPlant(plant) {
		return <PlantView value={plant}/>;
	}
}

export default PlantSelectionPage;