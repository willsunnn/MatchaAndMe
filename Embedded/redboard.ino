// Michael Felizardo and William Sun
// Final Project: Matcha and Me

// Redboard.ino
// Read sensor values for temperature, humidity, light level, and soil moisture
// Send sensor values to our web application
// Recieve commands from web application to control actuators
    // turn on water valve (represented by servo)
    // control light level of LED
    
#include <SparkFunRHT03.h>
#include <stdio.h>
#include <HttpClient.h>
#include "application.h"

#define RHT03_DATA_PIN D2       // RHT03 data pin
RHT03 rht;                      // Create RTH03 object
float hum;  // var to store hum sensor value
float temp; // var to store temop sensor value

#define LIGHT_SENSOR A0     // light sensor data pin
int light_analog;
float light;                // light level value as %

#define SOIL_SENSOR A1      // soil moisture sensor data pin
int soil_analog;
float soil;                 // soil moisture value as %

unsigned int nextTime = 0;    // Next time to contact the server
HttpClient http;
String hostname = "73.170.193.51";

// Headers currently need to be set at init, usefulfor API keys etc.
http_header_t headers[] = {
    //  { "Content-Type", "application/json" },
    //  { "Accept" , "application/json" },
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;


void setup() {
    
    Serial.begin(9600);
    
    rht.begin(RHT03_DATA_PIN);          // initialize rht03 sensor
    pinMode(LIGHT_SENSOR, INPUT);       // configures light sensor as an input
    pinMode(SOIL_SENSOR, INPUT);        // configures soil sensor as a input

}

void loop() {

    // Humidity and Temperature Reading Code //
    
    // Call rht.update() to get new humidity and temperature values from the sensor.
	int updateRet = rht.update();
	
	// If successful, the update() function will return 1.
	// If update fails, it will return a value <0
	if (updateRet == 1)
	{
		hum = rht.humidity(); // get humidity
		temp = rht.tempF();   // get temperature (in F)
	
	}
	else
	{
	    // If the update failed, try delaying for RHT_READ_INTERVAL_MS ms before
		// trying again.
		delay(RHT_READ_INTERVAL_MS);
	}
	
	// Light Sensor Reading Code //
	// low value means dim/little light, high value means bright/lot light
	light_analog = analogRead(LIGHT_SENSOR);
	light = light_analog / 4095.0;
	
	// Soil Moisture Reading Code //
	// low value means there is a lot of moisture, high value means it's dry
	soil_analog = analogRead(SOIL_SENSOR);
	soil = 1.0 - (soil_analog / 4095.0);
	
	// Print sensor values via Serial (used for debugging)
	Serial.printlnf("Temperature: %f deg F", temp);
	Serial.printlnf("Humidity: %f %%", hum);
	Serial.printlnf("Light Level: %f %%", light);
	Serial.printlnf("Soil Moisture: %f %%", soil);
	
	// Send data to web app
	if (nextTime > millis()) {
        return;
    }
	request.hostname = hostname;
    request.port = 5000;
    char buffer[200];
    sprintf(buffer, "/send-data/1?temp=%f&hum=%f&light=%f&soil=%f", temp, hum, light, soil);
    request.path = buffer;
    
    // Get request
    http.get(request, response, headers);
    Serial.print("Application>\tResponse status: ");
    Serial.println(response.status);
    
    Serial.print("Application>\tHTTP Response Body:");
    Serial.println(response.body);
    
    nextTime = millis() + 10000;
    
    
    // Actuator Code //
    
    // Water Valve (Servo) Control Code
        // For manual control:
            // recieve request from web app
            // adjust servo position based on request
            // report current state of servo back to web app
        // For automatic control:
            // based on soil moisture value, adjust servo position
            // report current state of servo back to web app

    // LED Control Code
        // For manual control:
            // recieve request from web app
            // turn on/off LED based on request
            // report current state of LED back to web app
        // For automatic control:
            // based on light level value, adjust LED if necessary
            // report current state of LED back to web app
	
	
	delay(5000);
	
}