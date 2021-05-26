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
float light;                // light level value as %

#define SOIL_SENSOR A1      // soil moisture sensor data pin
float soil;                 // soil moisture value as %

#define LED D3              // LED pin

#define SERVO D2            // servo pin
Servo servo;                // create servo object
int servo_pos;
int prev_servo_pos;

unsigned int nextTime = 0;          // Next time to contact the server
HttpClient http;
String hostname = "73.170.193.51";
char buffer[200];                   // buffer used for specifying url path

// Headers currently need to be set at init, usefulfor API keys etc.
http_header_t headers[] = {
    //  { "Content-Type", "application/json" },
    //  { "Accept" , "application/json" },
    { "Accept" , "*/*"},
    { NULL, NULL } // NOTE: Always terminate headers will NULL
};

http_request_t request;
http_response_t response;

struct ControlScheme {
	bool led_is_on;
	bool valve_is_auto_control;
	float valve_auto_value;
	float valve_manual_value;
	long valve_end_time;
};

// Json parser
int plant_id = 1;
ControlScheme control;




void setup() {
    deviceID = System.deviceID();       // get device ID
    Serial.println(deviceID);
    Serial.begin(9600);
    
    rht.begin(RHT03_DATA_PIN);          // initialize rht03 sensor
    pinMode(LIGHT_SENSOR, INPUT);       // configures light sensor as an input
    pinMode(SOIL_SENSOR, INPUT);        // configures soil sensor as a input
    
    pinMode(LED, OUTPUT);
    
    request.hostname = hostname;
    request.port = 5000;

    // declare a Particle function to manually control LED
    Particle.function("led", controlLED);
    
    // declare a Particle function to manually control water valve (servo)
    Particle.function("water", controlServo);
    
    // declare a Particle function to immediately update control scheme
    Particle.function("update", requestControlUpdate);

	// initialize control scheme defaults
	control.led_is_on = false;
	control.valve_is_auto_control = false;
	control.valve_auto_value = 0;
	control.valve_end_time = millis();
	control.valve_manual_value = 0;
	
	Serial.println("I am done setting up");
    Serial.println();
}

void loop() {
    
    // read analog sensor values for temp, hum, light, and soil moisture
    readAnalogSensors();
    
    // Water Valve (Servo) Control Code
    update_servo();
    
    // LED Control Code
    update_led();

	// Send data to web app
    sendDataIfTime();
}

void readAnalogSensors()
{
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
	int light_analog = analogRead(LIGHT_SENSOR);
	light = (light_analog / 4095.0) * 100;
	
	// Soil Moisture Reading Code //
	// low value means there is a lot of moisture, high value means it's dry
	int soil_analog = analogRead(SOIL_SENSOR);
	soil = (1.0 - (soil_analog / 4095.0)) * 100;
}

void sendDataIfTime() {
	if (nextTime > millis()) {
        return;
    }
    
    // Print sensor values via Serial (used for debugging)
	Serial.printlnf("Temperature: %f deg F", temp);
	Serial.printlnf("Humidity: %f %%", hum);
	Serial.printlnf("Light Level: %f %%", light);
	Serial.printlnf("Soil Moisture: %f %%", soil);
    
    // build url path for sending sensor data
    sprintf(buffer, "/send-data/1?temp=%4.2f&hum=%4.2f&light=%4.2f&soil=%4.2f", temp, hum, light, soil);
    request.path = buffer;
    
    // Get request
    get_http_request();
    
    // Parse JSON string from response body
    parse_json(response.body);

    nextTime = millis() + 10000;
}

// Particle Cloud function to manually control the LED
// for debugging, type the following in a terminal (assuming Particle CLI is installed):
    // particle call {device_id} led {command}
int controlLED(String command) {
    
    // build url path for getting json values
    sprintf(buffer, "/get-control/1");
    request.path = buffer;
    
    get_http_request();
    parse_json(response.body);
    
    update_led();
    
    return 1;
}


// Particle Cloud function to manually control the water valve (servo)
// for debugging, type the following in a terminal (assuming Particle CLI is installed):
    // particle call {device_id} water {command}, where {command} is an integer
int controlServo(String command) {
    
    // build url path for getting json values
    sprintf(buffer, "/get-control/1");
    request.path = buffer;
    
    get_http_request();
    parse_json(response.body);
    
    update_servo();
    
    return 1;
    
}

int requestControlUpdate(String command) {
    sprintf(buffer, "/get-control/1");
    request.path = buffer;
    
    get_http_request();
    parse_json(response.body);
	return 1;
}


void get_http_request()
{
    http.get(request, response, headers);
    Serial.print("Application>\tResponse status: ");
    Serial.println(response.status);
    
    Serial.print("Application>\tHTTP Response Body:");
    Serial.println(response.body);
    Serial.println();
}


void parse_json(String json)
{
	JsonParserStatic<256, 20> parser;
    parser.clear();
	parser.addString(json);
	

    // Test if parsing succeeds.
    if (!parser.parse()) {
		Serial.println("parsing failed");
		return;
	}
	
	// Get Json Values
	parser.getOuterValueByKey("plant_id", plant_id);
    parser.getOuterValueByKey("led_is_on", control.led_is_on);
    parser.getOuterValueByKey("valve_is_auto", control.valve_is_auto_control);
    
    // Serials for debugging
    Serial.printlnf("Plant ID is %d", plant_id);
    Serial.printlnf("Is LED on: %d", control.led_is_on);
    Serial.printlnf("Is valve auto: %d", control.valve_is_auto_control);
    
    if (!control.valve_is_auto_control)
    {
		float valve_remaining_time = 0;
        parser.getOuterValueByKey("valve_manual_value", control.valve_manual_value);
        parser.getOuterValueByKey("valve_remaining_time", valve_remaining_time);
		control.valve_end_time = millis() + long(valve_remaining_time * 1000);
        
        // Serials for debugging
        Serial.printlnf("Valve Manual Value: %f", control.valve_manual_value);
        Serial.printlnf("Valve Remaining Time: %f", valve_remaining_time);
    }
    else
    {
        parser.getOuterValueByKey("valve_auto_value", control.valve_auto_value);
        
        // Serial for debugging
        Serial.printlnf("Valve Auto Value: %f", control.valve_auto_value);
    }
    Serial.println();
}

// For manual control:
// turn on/off LED based on control scheme from server
void update_led() {
	int output = control.led_is_on? HIGH : LOW;
	digitalWrite(LED, output);
}

// For automatic control:
// 		Sets a target soil moisture and adjusts the servo to meet that soil moisture
// For Manual control:
// 		sets the servo to the value for a specified amount of time
void update_servo() {
    // automatically controlling water valve
    if (control.valve_is_auto_control) {
        // if current soil moisture is greater than target value, then don't need to open water valve
        if ((soil / 100.0) > control.valve_auto_value) // divided soil by 100 because soil is expressed as %
        {
            close_valve();		// close the valve
        }
        else
        {
            float valve_soil_diff = control.valve_auto_value - (soil / 100);
            open_valve(valve_soil_diff);    // make valve strength proportional to difference from current soil moisture to desired moisture
        }
    }
    // manually controlling water valve
    else    
    {
		long currTime = millis();
		float strength = control.valve_manual_value;
		if(currTime >= control.valve_end_time) {
			strength = 0;
		}
		open_valve(strength);
	}
}

void open_valve(float strength) {
    prev_servo_pos = servo_pos;
    servo_pos = strength * 179;
    if (servo_pos != prev_servo_pos)
    {
        servo.attach(SERVO);
        servo.write(servo_pos);
        delay(300);
        servo.detach();
    }
    
}

void close_valve() {
    open_valve(0);
}