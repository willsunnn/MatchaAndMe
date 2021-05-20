from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import datetime
import json

# setup Flask
app = Flask(__name__)

# setup SQL db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

class Plant(db.Model):
	plant_id = db.Column(db.String(50), primary_key=True, nullable=False)
	plant_name = db.Column(db.String(20), unique=False, nullable=False)
	measurements = db.relationship('Measurement', backref='plant', lazy=True)

	def __repr__(self):
		obj = {"plant_name":self.plant_name, "id":self.plant_id} 
		return json.JSONEncoder().encode(obj)

class Measurement(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	date_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
	hwid = db.Column(db.Integer, db.ForeignKey('plant.plant_id'), nullable=False)

	temp = db.Column(db.Float, nullable=False)
	humidity = db.Column(db.Float, nullable=False)
	light_level = db.Column(db.Float, nullable=False)
	soil_moisture = db.Column(db.Float, nullable=False)

	def __repr__(self):
		obj = {"datetime":self.date_time.isoformat(), "id":self.hwid, "temp":self.temp, "humidity":self.humidity, "light":self.light_level, "soil_moisture":self.soil_moisture} 
		return json.JSONEncoder().encode(obj)

@app.route("/")
@app.route("/plant")
def my_index():
	return render_template("index.html")


@app.route("/register-plant")
def register_plant():
	name = request.args.get("name")
	hwid = int(request.args.get("plant_id"))

	new_plant = Plant(plant_name=name, plant_id=hwid)
	db.session.add(new_plant)
	db.session.commit()
	return "plant registered"

@app.route("/send-data/<plant_id>")
def send_data(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.filter_by(plant_id=id).first()
	if plant is None:
		plant = Plant(plant_name="new plant", plant_id=id)
		db.session.add(plant)

	t = request.args.get("temp")
	h = request.args.get("hum")
	l = request.args.get("light")
	s = request.args.get("soil")

	new_measurement = Measurement(hwid=id, temp=t, humidity=h, light_level=l, soil_moisture=s)
	db.session.add(new_measurement)
	db.session.commit()
	return "success"

@app.route("/get-data/<plant_id>")
def get_data(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.filter_by(plant_id=id).first()
	if plant is None:
		return f"Could not find plant with ID {id}"
	else:
		return str(plant.measurements)

@app.route("/get-plants")
def get_plants():
	return str(list(Plant.query.all()))