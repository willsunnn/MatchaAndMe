import React from 'react';
import {Link} from 'react-router-dom';
import plantImg from '../resources/plant.png';

class PlantView extends React.PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			plant: props.plant
		};
	}

	render() {
		if(this.state.plant == null) {
			return ""
		}
		return (
		<div className="plant-view">
			<p>{this.state.plant.plant_name} has ID {this.state.plant.id}</p>
			<Link to={"/plants/"+this.state.plant.id}>View data</Link> 
		</div>
		);
	}
}

export default PlantView;