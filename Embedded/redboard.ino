// Michael Felizardo and William Sun
// Final Project: Matcha and Me

// Redboard.ino
// Read sensor values for temperature, humidity, light level, and soil moisture
// Send sensor values to our web application
// Recieve commands from web application to control actuators
    // turn on water valve (represented by servo)
    // control light level of LED

#include <JsonParserGeneratorRK.h>
#include <SparkFunRHT03.h>
#include <stdio.h>
#include <stdlib.h>
#include <HttpClient.h>
#include "application.h"

String deviceID;
String ACCESS_TOKEN = "70c03368690a979ad59072ae2a2d921fc3dc5b0b";

#define RHT03_DATA_PIN D6       // RHT03 data pin
RHT03 rht;                      // Create RTH03 object
float hum;  // var to store hum sensor value
float temp; // var to store temop sensor value

#define LIGHT_SENSOR A0     // light sensor data pin
int light_analog;
float light;                // light level value as %

#define SOIL_SENSOR A1      // soil moisture sensor data pin
int soil_analog;
float soil;                 // soil moisture value as %

#define LED D3              // LED pin

#define SERVO D2            // servo pin
Servo servo;                // create servo object
int servo_pos;
int servo_time;

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

// Json parser
JsonParserStatic<256, 20> parser;
int plant_id;
bool led_is_on;
bool valve_is_auto;
float valve_manual_value;
float valve_remaining_time;
float valve_auto_value;


void setup() {
    deviceID = System.deviceID();       // get device ID
    Serial.println(deviceID);
    Serial.begin(9600);
    
    rht.begin(RHT03_DATA_PIN);          // initialize rht03 sensor
    pinMode(LIGHT_SENSOR, INPUT);       // configures light sensor as an input
    pinMode(SOIL_SENSOR, INPUT);        // configures soil sensor as a input
    
    pinMode(LED, OUTPUT);
    
    //servo.attach(SERVO);                // attach servo to servo pin

    // declare a Particle function to manually control LED
    Particle.function("led", controlLED);
    
    servo_pos = 0;
    // declare a Particle function to manually control water valve (servo)
    Particle.function("water", controlServo);
    Serial.println("I am done setting up");
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
	light = (light_analog / 4095.0) * 100;
	
	// Soil Moisture Reading Code //
	// low value means there is a lot of moisture, high value means it's dry
	soil_analog = analogRead(SOIL_SENSOR);
	soil = (1.0 - (soil_analog / 4095.0)) * 100;

	
	// Send data to web app
	if (nextTime > millis()) {
        return;
    }
    
    // Print sensor values via Serial (used for debugging)
	Serial.printlnf("Temperature: %f deg F", temp);
	Serial.printlnf("Humidity: %f %%", hum);
	Serial.printlnf("Light Level: %f %%", light);
	Serial.printlnf("Soil Moisture: %f %%", soil);
    
	request.hostname = hostname;
    request.port = 5000;
    char buffer[200];
    sprintf(buffer, "/send-data/1?temp=%4.2f&hum=%4.2f&light=%4.2f&soil=%4.2f", temp, hum, light, soil);
    request.path = buffer;
    
    // Get request
    http.get(request, response, headers);
    Serial.print("Application>\tResponse status: ");
    Serial.println(response.status);
    
    Serial.print("Application>\tHTTP Response Body:");
    Serial.println(response.body);
    Serial.println();
    
    // Parse JSON string from response body
    parser.clear();
	parser.addString(response.body);
    
    // Test if parsing succeeds.
    if (!parser.parse()) {
		Serial.println("parsing failed test2");
		return;
	}
	
	parser.getOuterValueByKey("plant_id", plant_id);
    parser.getOuterValueByKey("led_is_on", led_is_on);
    parser.getOuterValueByKey("valve_is_auto", valve_is_auto);
    
    // Serials for debugging
    Serial.printlnf("Plant ID is %d", plant_id);
    Serial.printlnf("Is LED on: %d", led_is_on);
    Serial.printlnf("Is valve auto: %d", valve_is_auto);
    
    if (!valve_is_auto)
    {
        parser.getOuterValueByKey("valve_manual_value", valve_manual_value);
        parser.getOuterValueByKey("valve_remaining_time", valve_remaining_time);
        
        // Serials for debugging
        Serial.printlnf("Valve Manual Value: %f", valve_manual_value);
        Serial.printlnf("Valve Remaining Time: %f", valve_remaining_time);
    }
    else
    {
        parser.getOuterValueByKey("valve_auto_value", valve_auto_value);
        
        // Serial for debugging
        Serial.printlnf("Valve Auto Value: %f", valve_auto_value);
    }
    Serial.println();
    
    
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


// for debugging, type the following in a terminal (assuming Particle CLI is installed):
    // particle call {device_id} led {command}
int controlLED(String command) {
    if (command == "on")
    {
        digitalWrite(LED, HIGH);
        return 1;
    }
    else if (command == "off")
    {
        digitalWrite(LED, LOW);
        return 1;
    }
    else
    {
        return -1;
    }
}

// for debugging, type the following in a terminal (assuming Particle CLI is installed):
    // particle call {device_id} water {command}, where {command} is an integer
int controlServo(String command) {
    Serial.println("Command is " + command);
    servo_pos = command.toInt();
    Serial.print("Servo pos at ");
    Serial.println(servo_pos);
    if (-1 < servo_pos < 180)
    {
        servo.attach(SERVO);
        servo.write(servo_pos);
        delay(300);
        servo.detach();
        Serial.println("Servo moved (plz)");
        return servo_pos;
    }
    else
    {
        return -1;
    }
    
}





