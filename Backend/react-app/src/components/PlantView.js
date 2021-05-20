import React from 'react';
import {Link} from 'react-router-dom';
import plantImg from '../resources/plant.png';

class PlantView extends React.PureComponent {
	// construct with plant in props
	// props.plant is a plant object

	render() {
		if(this.props.plant == null) {
			return ""
		}
		return (
		<div className="plant-view">
			<p>{this.props.plant.plant_name} has ID {this.props.plant.id}</p>
			<Link to={"/plants/"+this.props.plant.id}>View data</Link> 
		</div>
		);
	}
}

export default PlantView;