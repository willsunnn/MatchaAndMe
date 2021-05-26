# Overview

This directory serves as the backend for our system

The system comprises of 3 components
- SQL database
- Backend Server
- React Server

# Referenced Tutorials
- https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/
- https://blog.learningdollars.com/2019/11/29/how-to-serve-a-reactapp-with-a-flask-server/


# Exposed Pages

### Index (View list of plants)
- <IP_ADDRESS>:5000/

### Plant Data and Control View
- <IP_ADDRESS>:5000/plant/<plant_id>


# API

### Get Plants
	This gets a list of all registered plants.

	Endpoint:
	- <IP_ADDRESS>:5000/get-plants			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-plants

	Returns:
	- Returns a list of all the plants

## Endpoints to add/retrieve a plant

### Register Plant 
	This adds a plant to the database, allowing you to add measurements for that plant

	Endpoint:
	- <IP_ADDRESS>:5000/register-plant			(GET)

	Query Args
	- name (String)
	- plant_id (Integer) (Must be Unique)

	Example:
	- <IP_ADDRESS>:5000/register-plant?name=plant1&plant_id=1

	Returns:
	- Returns the plant's ID and name 

### Get Plant 
	This adds a plant to the database, allowing you to add measurements for that plant

	Endpoint:
	- <IP_ADDRESS>:5000/get-plant/<plant_id>			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-plant/1

	Returns:
	- Returns the plant's ID and name 

## Endpoints to add/retrieve data points

### Send Data
	This adds a measurement at a given point of time. The time at which the request is received is the timestamp attached to the data. If the plant_id is not associated with a plant, a new plant will be created

	Endpoint:
	- <IP_ADDRESS>:5000/send-data/<plant_id>			(GET)

	Query Args:
	- temp (Float)
	- hum (Float)
	- light (Float)
	- soil (Float)

	Example:
	- <IP_ADDRESS>:5000/send-data/1?temp=5.0&hum=1.0&light=2.5&soil=2.3
	
	Returns:
	- Returns the plant's control scheme (see Control Scheme)

### Get Data
	This gets past measurement of a plant. Returns "Could not find plant with ID {id}" if no plant with such ID exists

	Endpoint:
	- <IP_ADDRESS>:5000/get-data/<plant_id>			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-data/1

	Returns:
	- Returns a list of all the plant's data points

## Endpoints to update/retrieve control schemes

### Get Control Scheme
	This gets the control scheme of the plant. 

	Endpoint:
	- <IP_ADDRESS>:5000/get-control/<plant_id>			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-control/1

	Returns:
	- Returns the control scheme in JSON notation
    	- plant_id 					int				the plant's ID
    	- led_is_on 				boolean			whether the LED is on or off
    	- valve_is_auto				boolean			whether valve control is automatic or manual
    	- valve_auto_value			float			the desired moisture of the plant (ranges from 0-1). Only present if valve_is_auto is true
    	- valve_manual_value		float			the desired strength of the valve (ranges from 0-1). Only present if valve_is_auto is false
    	- valve_remaining_time		float			how long the valve should be open (in seconds). Only present if valve_is_auto is false

### Update LED status
	Turns the LED for a plant on or off

	Endpoint:
	- <IP_ADDRESS>:5000/update-led-control/<plant_id>			(GET)

	Query Args:
	- is_on 	(boolean)

	Example:
	- <IP_ADDRESS>:5000/update-led-control/3?is_on=false

	Returns:
	- Returns the control scheme in JSON notation

### Update Valve Control (Automatic)
	Set the valve control for the plant to be automatic

	Endpoint:
	- <IP_ADDRESS>:5000/update-valve-control/<plant_id>			(GET)

	Query Args:
	- is_auto 			(boolean)	(set to true for automatic control)
	- valve_auto_value 	(float)		(target moisture of the soil, ranging from 0 to 1)

	Example:
	- <IP_ADDRESS>:5000/update-valve-control/3?is_auto=true&valve_auto_value=0.6

	Returns:
	- Returns the control scheme in JSON notation

### Update Valve Control (Manual)
	Set the valve control for the plant to be manual

	Endpoint:
	- <IP_ADDRESS>:5000/update-valve-control/<plant_id>			(GET)

	Query Args:
	- is_auto 				(boolean)	(set to false for manual control)
	- valve_manual_value 	(float)		(how strong the valve should be ranging from 0-1)
	- valve_manual_duration	(float)		(remaining time in seconds the valve should be on)

	Example:
	- <IP_ADDRESS>:5000/update-valve-control/3?is_auto=false&valve_manual_value=0.4&valve_manual_duration=5

	Returns:
	- Returns the control scheme in JSON notation

# Steps

In order to run the server, these are the required steps

1) Build React Frontend
   1) go to react-app directory
   2) run command "npm run build"
2) Start Flask backend
   1) go to flask-server directory
   2) create and activate virtual environment (optional)
      1) venv/scripts/activate
   3) install pip requirements
      1) pip install requirements.txt
   4) Create SQL Database Instance
      1) in directory where main.py is
      2) run python interpreter (type python)
      3) run "from main import db"
      4) run "db.create_all()"
   5) set environment variable FLASK_APP to main.py
      1) on windows:	$env:FLASK_APP="main.py"
      2) on unix OS:	export FLASK_APP main.py
   6) run command "flask run --host=0.0.0.0"