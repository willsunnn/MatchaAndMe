// Michael Felizardo and William Sun
// Final Project: Matcha and Me

// Redboard.ino
// Read sensor values for temperature, humidity, light level, and soil moisture
// Send sensor values to our web application
// Recieve commands from web application to control actuators
    // turn on water valve (represented by servo)
    // control light level of LED
    
#include <SparkFunRHT03.h>

#define RHT03_DATA_PIN D2       // RHT03 data pin
RHT03 rht;                      // Create RTH03 object
float hum;  // var to store hum sensor value
float temp; // var to store temop sensor value

#define LIGHT_SENSOR A0     // light sensor data pin
int light_value;

#define SOIL_SENSOR A1      // soil moisture sensor data pin
int soil_value;



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
	light_value = analogRead(LIGHT_SENSOR);
	
	// Soil Moisture Reading Code //
	soil_value = analogRead(SOIL_SENSOR);
	
	
	// Print sensor values via Serial (used for debugging)
	Serial.printlnf("Temperature: %f deg F", temp);
	Serial.printlnf("Humidity: %f %%", hum);
	Serial.printlnf("Light Level: %d", light_value);
	Serial.printlnf("Soil Moisture: %d", soil_value);
	
	delay(5000);
	
}