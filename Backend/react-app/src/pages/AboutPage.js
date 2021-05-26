import React from 'react';
import NavBarView from '../components/NavBar';


class AboutPage extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
		<div>
			<NavBarView title="About Us"/>
			<h1>About Page</h1>
		</div>
		)
	}
}

export default AboutPage;