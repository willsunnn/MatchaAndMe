import React from 'react';
import { Grid, AppBar, Toolbar, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import { makeStyles, withStyles } from "@material-ui/core"
import matchaImg from '../resources/matcha.png'

const navLinks = [
	{ title: `Home`, path: `/` },
	{ title: `About`, path: `/about` }
]

const styles = theme => ({
	navbar: {
		background: "#dbff9e"
	},
	title: {
		color: 'black'
	},
	navDisplayFlex: {
		display: `flex`,
		justifyContent: `right`,
		justify: 'flex-end'
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `black`
	}
});

class NavBarView extends React.PureComponent {

	render() {
		const { classes } = this.props;
		return (
			<AppBar position="static" className={classes.navbar}>
				<Toolbar>
					<Grid container justify="flex-start">
						<Typography variant="h6" className={classes.title}>
							{this.props.title}
						</Typography>
					</Grid>
					<Grid container justify="flex-end">
						<List component="nav" aria-labelledby="main navigation" className={classes.navDisplayFlex}>
							{navLinks.map(({ title, path }) => (
								<a href={path} key={title} className={classes.linkText}>
									<ListItem button>
										<ListItemText primary={title} />
									</ListItem>
								</a>
							))}
						</List>
					</Grid>
				</Toolbar>
			</AppBar>
		)
	}
}

export default withStyles(styles, { withTheme: true })(NavBarView);
