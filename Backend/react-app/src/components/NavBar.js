import React from 'react';
import {Grid, AppBar, Toolbar, List, ListItem, ListItemText, Typography} from "@material-ui/core"
import { makeStyles } from "@material-ui/core"
import matchaImg from '../resources/matcha.png'

const navLinks = [
	{ title: `Home`, path: `/` },
	{ title: `About`, path: `/about` }
]

const useStyles = makeStyles({
	title: {

	}, 
	navDisplayFlex: {
		display: `flex`,
		justifyContent: `right`,
		justify: 'flex-end'
	},
	linkText: {
		textDecoration: `none`,
		textTransform: `uppercase`,
		color: `white`
	}
});

function NavBarView(props) {
	const classes = useStyles();
	return (
	<AppBar position="static">
		<Toolbar>
			<Grid container justify="flex-start">
			<Typography variant="h6" className={classes.title}>
				{props.title}
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


export default NavBarView;
