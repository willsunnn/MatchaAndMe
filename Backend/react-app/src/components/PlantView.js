import React from 'react';
import plantImg from '../resources/plant.png';

class PlantView extends React.PureComponent {

	constructor(props) {
		super(props);
		console.log(props);
		this.state = {
			name: props.plant.plant_name,
			id: props.plant.id
		};

		console.log(this.state);
	}

	render() {
		return (
			<div className="plant-view">
				<p>{this.state.name} has ID {this.state.id}</p>
			</div>
		);
	}
}

export default PlantView;