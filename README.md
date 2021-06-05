# Matcha & Me

## The overall goals of our project is to:
1. Accurately measure important values regarding plant growth using sensors and present it to the user via a mobile app or web application 
2. Analyze these values in order to make reasonable suggestions for maintaining or improving plant growth
3. Control actuators that can directly influence plant growth, such as water valves and light sources

## Components:
- Backend component
  - stores historical data
  - used to perform more complex analysis
  - used to serve frontend for easy access to data and controls
- Distributed Nodes component
  - used to collect data and relay data to the backend component
  - used to controol plant growth

## About Us:
### Project Proposal
[![Project Proposal Video](https://img.youtube.com/vi/GTM4FukWBOQ/0.jpg)](https://youtu.be/GTM4FukWBOQ)

### Project Demo
[![Project Proposal Video](https://img.youtube.com/vi/8vKVrBCnxVU/0.jpg)](https://youtu.be/8vKVrBCnxVU)

## Sample Database:
There is a sample database at the root directory ```sample-database.db```
To use the data in the database, copy the file to ```Backend/flask-server/``` and name it ```database.db```
The database contains data for plant #1 from June 1st 2021 to June 4th 2021
