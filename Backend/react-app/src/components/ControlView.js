import React from 'react';
import Switch from "react-switch";
import clsx from 'clsx';
import { withStyles, Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center"
	},
	rootCard: {
		"margin": "20px"
	},
	title: {
		"color": 'black',
		"text-align": 'center',
		"margin-left": "20px",
		"margin-right": "20px"
	},
});

class ControlView extends React.PureComponent {
	// construct with data props
	// data is an array of observation objects

	constructor(props) {
		super(props);
		this.state = {
			expanded: false,
			auto_toggle_is_checked:false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleExpandClick = this.handleExpandClick.bind(this);
	}

	handleChange(checked) {
		this.setState({auto_toggle_is_checked: checked});
		console.log(this.state);
	}

	handleExpandClick() {
		this.setState({expanded: !this.state.expanded})
	};

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.parentDiv}>
			<Card className={classes.rootCard} variant="outlined">
				<CardContent>
					<Typography variant="h6" className={classes.title}>
						Plant Control
					</Typography>
				</CardContent>
				
				<CardActions disableSpacing>
					<IconButton
						className={clsx(classes.expand, {
							[classes.expandOpen]: this.state.expanded,
						})}
						onClick={this.handleExpandClick}
						aria-expanded={this.state.expanded}
						aria-label="show more"
						>
					<ExpandMoreIcon />
					</IconButton>
				</CardActions>

				<Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
					<CardContent>
					<Typography paragraph>Testing</Typography>
					</CardContent>
				</Collapse>
			</Card>
			<label>
				<span>Switch with default style</span>
				<Switch onChange={this.handleChange} checked={this.state.auto_toggle_is_checked} />
				<p></p>
			</label>
			</div>
		)
	}
}

export default withStyles(styles, { withTheme: true })(ControlView);