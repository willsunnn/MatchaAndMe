import React from 'react';
import styles from '../css/dataview.module.css';

class DataView extends React.PureComponent {
	// construct with data props
	// data is an array of observation objects

	render() {
		return (<table style={styles.table}>	
			<tr>
				<th>Date and Time</th>
				<th>Temperature (deg F)</th>
				<th>Humidity (%)</th>
				<th>Light Level (out of 4096)</th>
				<th>Soil Moisture (out of 4096)</th>
			</tr>
			{
				this.props.data.map(
					data => 
					<tr>
						<td>{data.datetime}</td>
						<td>{data.temp}</td>
						<td>{data.humidity}</td>
						<td>{data.light}</td>
						<td>{data.soil_moisture}</td>
					</tr>	
				)
			}
		</table>)
	}
}

export default DataView;