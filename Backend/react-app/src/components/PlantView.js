import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from "@material-ui/core"
import { withStyles } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import plantImg from '../resources/plant.png';

const styles = theme => ({
	parentDiv: {
		"display": "flex",
		"alignItems": "center",
		"justifyContent": "center"
	},
	rootCard: {
		"width": "180px",
		"margin": "20px"
	},
	title: {
		"color": 'black',
		"text-align": 'center',
		"margin-left": "20px",
		"margin-right": "20px"
	},
	id_label: {
		"color": 'black',
		"text-align": 'center',
		"margin-left": "20px",
		"margin-right": "20px",
		"margin-bottom": "20px"
	},
	media: {
		"height": "140px",
		"width": "140px",
		"margin-left": "20px",
		"margin-right": "20px",
		"margin-top": "20px"
	},
});

class PlantView extends React.PureComponent {
	// construct with plant in props
	// props.plant is a plant object

	get_plant_name() {
		if(this.props.plant == null) {
			return "loading"
		} else {
			return this.props.plant.plant_name
		}
	}

	get_plant_id() {
		if(this.props.plant == null) {
			return -1
		} else {
			return this.props.plant.id
		}
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.parentDiv}>
			<Card className={classes.rootCard} variant="outlined">
				<CardActionArea>
					<Link to={"/plants/" + this.get_plant_id()}>
						<CardMedia
							className={classes.media}
							image={plantImg}
							title="Plant Image"
							/>
						<CardContent>
							<Typography variant="h6" className={classes.title}>
							{this.get_plant_name()}
							</Typography>
							<Typography variant="body1" className={classes.id_label}>
							{"Plant ID: "+this.get_plant_id()}
							</Typography>
						</CardContent>
					</Link>	
				</CardActionArea>	
			</Card>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(PlantView);