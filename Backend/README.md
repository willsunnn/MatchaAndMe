# Overview

This directory serves as the backend for our system

The system comprises of 3 components
- SQL database
- Backend Server
- React Server

# Referenced Tutorials
- https://flask-sqlalchemy.palletsprojects.com/en/2.x/quickstart/
- https://blog.learningdollars.com/2019/11/29/how-to-serve-a-reactapp-with-a-flask-server/


# API

## Register Plant 
	This adds a plant to the database, allowing you to add measurements for that plant

	Endpoint:
	- <IP_ADDRESS>:5000/register-plant			(GET)

	Query Args
	- name (String)
	- plant_id (Integer) (Must be Unique)

	Example:
	- <IP_ADDRESS>:5000/register-plant?name=plant1&plant_id=1]

## Send Data
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

## Get Data
	This gets past measurement of a plant. Returns "Could not find plant with ID {id}" if no plant with such ID exists

	Endpoint:
	- <IP_ADDRESS>:5000/get-data/<plant_id>			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-data/1

## Get Plants
	This gets a list of all registered plants.

	Endpoint:
	- <IP_ADDRESS>:5000/get-plants			(GET)

	Example:
	- <IP_ADDRESS>:5000/get-plants

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