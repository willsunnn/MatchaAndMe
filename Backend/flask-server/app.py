from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy
import datetime
import json
import urllib.request

# setup Flask
app = Flask(__name__)

# setup SQL db
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)






"""
	Database Models
"""

class Plant(db.Model):
	plant_id = db.Column(db.String(50), primary_key=True, nullable=False)
	plant_name = db.Column(db.String(20), unique=False, nullable=False)
	measurements = db.relationship('Measurement', backref='plant', lazy=True)
	control = db.relationship('ControlScheme', uselist=False, backref='plant', lazy=True)

	particle_device_id = db.Column(db.String(50), nullable=True, default=None)
	particle_device_access_token = db.Column(db.String(50), nullable=True, default=None)

	def __repr__(self):
		obj = {"plant_name":self.plant_name, "id":self.plant_id} 
		return json.JSONEncoder().encode(obj)


class ControlScheme(db.Model):
	plant_id = db.Column(db.Integer, db.ForeignKey('plant.plant_id'), primary_key=True)
	led_is_on = db.Column(db.Boolean, nullable=False)

	valve_is_auto = db.Column(db.Boolean, nullable=False)
	valve_auto_value = db.Column(db.Float, nullable=True)
	valve_manual_value = db.Column(db.Float, nullable=True)
	valve_manual_start = db.Column(db.DateTime, default=datetime.datetime.utcnow)
	valve_manual_duration = db.Column(db.Integer, nullable=True)		# seconds of how long the valve should be open

	def get_remaining_time_in_millis(self) -> int:
		end_time = self.valve_manual_start + datetime.timedelta(seconds=self.valve_manual_duration)
		if end_time > datetime.datetime.now():
			return (end_time - datetime.datetime.now()).total_seconds()
		else:
			return 0

	def __repr__(self):
		obj = {"plant_id":self.plant_id, "led_is_on":self.led_is_on, "valve_is_auto":self.valve_is_auto}
		if self.valve_is_auto:
			obj["valve_auto_value"] = self.valve_auto_value
		else:
			obj["valve_manual_value"] = self.valve_manual_value
			obj["valve_remaining_time"] = self.get_remaining_time_in_millis()
		return json.JSONEncoder().encode(obj)


class Measurement(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	date_time = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
	plant_id = db.Column(db.Integer, db.ForeignKey('plant.plant_id'), nullable=False)

	temp = db.Column(db.Float, nullable=False)
	humidity = db.Column(db.Float, nullable=False)
	light_level = db.Column(db.Float, nullable=False)
	soil_moisture = db.Column(db.Float, nullable=False)

	def __repr__(self):
		obj = {"datetime":self.date_time.isoformat(), "plant_id":self.plant_id, "temp":self.temp, "humidity":self.humidity, "light":self.light_level, "soil_moisture":self.soil_moisture} 
		return json.JSONEncoder().encode(obj)



"""
	Frontend Routes
"""

@app.route("/")
def view_home():
	return render_template("index.html")

@app.route("/about")
def view_about():
	return render_template("index.html")

@app.route("/plants/<plant_id>")
def view_plant(plant_id):
	return render_template("index.html")




"""
	Endpoint to get list of all plants
"""

@app.route("/get-plants")
def get_plants():
	return str(list(Plant.query.all()))




"""
	Endpoints to add/retrieve a plant
"""

def add_plant(plant_id: int, name: str):
	control = ControlScheme(plant_id=id, led_is_on=False, valve_is_auto=False, valve_manual_value=0, valve_manual_start=datetime.datetime.now(), valve_manual_duration=0)
	new_plant = Plant(plant_name=name, plant_id=plant_id, control=control)
	db.session.add(new_plant)
	db.session.commit()

@app.route("/register-plant")
def register_plant():
	name = request.args.get("name")
	hwid = int(request.args.get("plant_id"))
	add_plant(hwid, name)
	return "plant registered"

@app.route("/get-plant/<plant_id>")
def get_plant(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		return "null"
	else:
		return str(plant)

@app.route("/add-particle-id/<plant_id>")
def add_particle_id(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		add_plant(id, "new plant")
		plant = Plant.query.get(plant_id)
	
	particle_id = request.args.get("particle_id")
	access_token = request.args.get("access_token")

	plant.particle_device_id = particle_id
	plant.particle_device_access_token = access_token
	db.session.commit()
	return "success"




"""
	Endpoints to add/retrieve data points
"""

@app.route("/send-data/<plant_id>")
def send_data(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		add_plant(id, "new plant")
		plant = Plant.query.get(plant_id)

	t = request.args.get("temp")
	h = request.args.get("hum")
	l = request.args.get("light")
	s = request.args.get("soil")

	new_measurement = Measurement(plant_id=id, temp=t, humidity=h, light_level=l, soil_moisture=s)
	db.session.add(new_measurement)
	db.session.commit()
	return str(plant.control)

@app.route("/get-data/<plant_id>")
def get_data(plant_id):
	id = int(plant_id)
	start = request.args.get("start")
	end = request.args.get("end")
	measurements = Measurement.query.filter(Measurement.plant_id == id)
	if start is not None:
		start = datetime.datetime.fromisoformat(start)
		measurements = measurements.filter(Measurement.date_time >= start)
	if end is not None:
		end = datetime.datetime.fromisoformat(end)
		measurements = measurements.filter(Measurement.date_time <= end)
	return str(measurements.all())




"""
	Endpoints to update/retrieve control schemes
"""

# This function is used to ping the particle so that the particle
# will perform a /get-control<plant_id>/ request
# this will force the particle to update to the most recent control
# scheme in in the database to ensure that controls are responsive
def ping_particle_to_update_control_scheme(plant_id):
	plant: Plant = Plant.query.get(plant_id)
	if plant is None or plant.particle_device_id is None or plant.particle_device_access_token is None:
		return "could not find plant, or plant does not have device ID / access token"
	ping_url = f"https://api.particle.io/v1/devices/{plant.particle_device_id}/update?access_token={plant.particle_device_access_token}"
	data = urllib.parse.urlencode({'message':"pinging particle"})		# this payload doesn't actually have any effect, but it needs to not be empty
	data = data.encode('ascii')
	req = urllib.request.Request(ping_url, data)
	with urllib.request.urlopen(req) as response:
		print(response.read())

@app.route("/get-control/<plant_id>")
def get_control(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		return f"Could not find plant with ID {id}"
	else:
		return str(plant.control)
	
def parse_boolean(s):
	return (s.lower() in ['true'])

@app.route("/update-led-control/<plant_id>")
def update_led_control(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		return f"Could not find plant with ID {id}"
	else:
		plant.control.led_is_on = parse_boolean(request.args.get("is_on"))
		db.session.commit()
		ping_particle_to_update_control_scheme(id)
		return str(plant.control)

@app.route("/update-valve-control/<plant_id>")
def update_valve_control(plant_id):
	id = int(plant_id)
	plant: Plant = Plant.query.get(plant_id)
	if plant is None:
		return f"Could not find plant with ID {id}"
	else:
		is_auto = parse_boolean(request.args.get("is_auto"))
		plant.control.valve_is_auto = is_auto
		if is_auto:
			plant.control.valve_auto_value = float(request.args.get("valve_auto_value"))
		else:
			plant.control.valve_manual_value = float(request.args.get("valve_manual_value"))
			plant.control.valve_manual_start = datetime.datetime.now()
			plant.control.valve_manual_duration = int(request.args.get('valve_manual_duration'))
		db.session.commit()
		ping_particle_to_update_control_scheme(id)
		return str(plant.control)