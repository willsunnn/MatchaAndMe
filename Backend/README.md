This directory serves as the backend for our system

The system comprises of 3 components
- SQL database
- Backend Server
- React Server

In order to run the server, these are the required steps

1) Build React Frontend
   1) go to react-app directory
   2) run command "npm run build"
2) Start Flask backend
   1) go to flask-server directory
   2) set environment variable FLASK_APP to main.py
      1) on windows:	$env:FLASK_APP="main.py"
      2) on unix OS:	export FLASK_APP main.py
   3) run command "flask run --host=0.0.0.0"