import React from 'react';
import NavBarView from '../components/NavBar';
import { Typography, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core";

const styles = theme => ({
	bodyDiv: {
		"color": 'black',
		"text-align": 'center',
		"margin": "20px"
	},
	sectionDiv: {
		"color": 'black',
		"text-align": 'center',
		"margin": "20px"
	}
});


class AboutPage extends React.Component {
	render() {
		const { classes } = this.props;
		return (
		<div>
		<NavBarView title="About Us"/>
		<div className={classes.bodyDiv}>

			<Typography variant="h4" className={classes.title}>
				About Matcha & Me
			</Typography>
			
			<div className={classes.sectionDiv}>
			<Typography variant="subtitle1" className={classes.title}>
				Project Proposal
			</Typography>
			<iframe width="420" height="315"
			src="https://www.youtube.com/embed/GTM4FukWBOQ">
			</iframe> 
			</div>
			
			<div className={classes.sectionDiv}>
			<Typography variant="subtitle1" className={classes.title}>
				Project Demo
			</Typography>
			<iframe width="420" height="315"
			src="https://www.youtube.com/embed/GTM4FukWBOQ">
			</iframe> 
			</div>

			<div className={classes.sectionDiv}>
			<Typography variant="subtitle1" className={classes.title}>
				Github Link!
			</Typography>
			<Typography variant="body1" className={classes.title}>
				<Link href="https://github.com/willsunnn/MatchaAndMe">
				https://github.com/willsunnn/MatchaAndMe
				</Link>
			</Typography>
			</div>
		</div>
		</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(AboutPage);