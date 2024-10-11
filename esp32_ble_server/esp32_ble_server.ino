#include <Arduino.h>
#include <math.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "DHT_Async.h"

// Temp Sensor
#define DHT_SENSOR_TYPE DHT_TYPE_11
static const int DHT_SENSOR_PIN = 23;
DHT_Async dht_sensor(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

// Other Peripherals pins
static const int SOUND_SENSOR_PIN = 34;
static const int GAS_SENSOR_PIN = 33;
static const int BUZZER_PIN = 22;
static const int LED_PIN = 32;

// BLE Server Setup's
#define SERVICE_UUID        "8b712be9-e6cd-4356-b703-beca1b406f5c"
#define CHARACTERISTIC_UUID "137700a2-86a4-4f8f-8864-b1839db64ef6"
BLECharacteristic *pCharacteristic;
class ServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      pServer->startAdvertising(); // restart advertising
    };

    void onDisconnect(BLEServer* pServer) {
      pServer->startAdvertising(); // restart advertising
    }
};

void setup_ble() {
  Serial.println("---- Starting BLE Server ----");
  // device name
  BLEDevice::init("SafetySense");
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks()); //set the callback function
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setValue("No Data");
  pService->start();

  // BLE server broadcast
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);  // functions that help with iPhone connections issue
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();

  Serial.println("---- BLE Server Started ----");
}

void setup() {
    Serial.begin(115200);
    setup_ble();
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
}


static bool fetch_temp(float *temperature, float *humidity) {
    static unsigned long measurement_timestamp = millis();

    /* Measure once every four seconds. */
    if (millis() - measurement_timestamp > 5000ul) {
        // Serial.println("fetching temp");
        if (dht_sensor.measure(temperature, humidity)) {
            measurement_timestamp = millis();
            return (true);
        }
    }

    return (false);
}

int mainCounter = 0;

bool alarmOn = false;
bool toneOn = false;
int alarmFreq = 550;

int soundVoltage;
int largestSoundVoltage;
int soundSensitivity = 38;
float dbRef = 26.3;
float vRef = 884;
float db;

int gasVoltage;

float temperature;
float humidity;

void alarmBeep() {
  if (alarmOn) {
    if (toneOn) {
      noTone(BUZZER_PIN);
      digitalWrite(LED_PIN, LOW);
      toneOn = false;
    } else {
      tone(BUZZER_PIN, alarmFreq);
      digitalWrite(LED_PIN, HIGH);
      toneOn = true;
    }
  } else {
    if (toneOn) {
      noTone(BUZZER_PIN);
      digitalWrite(LED_PIN, LOW);
      toneOn = false;
    } 
  }
}

/*
 * Main program loop.
 */
void loop() {
  mainCounter++;

  if (mainCounter % 100 == 0) {
    alarmBeep();
  }

  if (mainCounter % 2000 == 0) {
    // every 2000 loops (~2 seconds)
    // get gas sensor reading 
    gasVoltage = analogRead(GAS_SENSOR_PIN);
  }
  
  // get sound voltage
  soundVoltage = analogRead(SOUND_SENSOR_PIN);
  if (soundVoltage > largestSoundVoltage) {
    largestSoundVoltage = soundVoltage;
  }

  if (mainCounter % 5000 == 0) {
    // every 5000 loops (~5 seconds)
    db = dbRef + (soundSensitivity * (20 * log10((largestSoundVoltage / vRef))));
    Serial.print(db);
    Serial.println(" dB");
    largestSoundVoltage = 0;
      
    /* Measure temperature and humidity.  If the functions returns
    true, then a measurement is available. */
    if (fetch_temp(&temperature, &humidity)) {
        Serial.print(temperature, 1);
        Serial.println(" °C");  
    }

    Serial.println(gasVoltage);

    if (db > 110 || temperature > 35 || gasVoltage > 1400) {
      alarmOn = true;
    }

    // update server 
    pCharacteristic->setValue(String(temperature) + "," + String(db) + "," + String(gasVoltage));
  }

  // reset counter every 10000 loops (~10s)
  if (mainCounter >= 10000) {
    mainCounter = 0;
  }

  delay(1); // main loop clock speed: 1 ms
}
