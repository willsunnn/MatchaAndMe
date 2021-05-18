import React from 'react';
import plantImg from '../resources/plant.png';

class PlantView extends React.PureComponent {
	render() {
		return (
			<div className="plant-view">
			<img src={plantImg} alt="Plant Image"/>
			</div>
		);
	}
}

export default PlantView;