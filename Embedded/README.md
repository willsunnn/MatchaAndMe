# Responsibilities of the Embedded System
1) Read data from sensors, and post it to the server through WiFi
2) Get control scheme from server, and control actuators (valve and LED) based off server values

# Required Hardware
<table>
    <thead>
        <tr>
            <th>Hardware</th>
            <th>Quantity</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Sparkfun Photon Redboard</td>
            <td>1</td>
		</tr>
		<tr>
			<td>Seeedstudio Grove for Arduino - Starter Kit V3
				<br />----Seeedstudio Grove Base Shield
				<br />----Seeedstudio Light Sensor
				<br />----Servo (placeholder for watering valve)
				</td>
			<td>1</td>
		</tr>
		<tr>
			<td>Moisture Sensor (<a href="https://www.amazon.com/gp/product/B089RQF371/">Purchased Here</a>)</td>
			<td>1</td>
		</tr>
		<tr>
			<td>Temperature and Humidity Sensor - RHT03</td>
			<td>1</td>
		</tr>
		<tr>
			<td>LED Light</td>
			<td>1</td>
		</tr>
    </tbody>
</table>

# Hardware Connections
What hardware connects to what pins
add picture ideally

# Setup
Flash code in particle
Add libraries

# Code modifications
manually set ID, and particle auth token in code