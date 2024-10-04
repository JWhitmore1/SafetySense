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

// Sound Sensor
static const int SOUND_SENSOR_PIN = 34;

// buzzer
static const int BUZZER_PIN = 22;

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
int soundSensitivity = 43;
float dbRef = 26.3;
float vRef = 884;
float db;

float temperature;
float humidity;
/*
 * Main program loop.
 */
void loop() {
  mainCounter++;

  if (mainCounter % 50 == 0) {
    // every 1000 loops (~1 Second)
    if (alarmOn) {
      if (toneOn) {
        noTone(BUZZER_PIN);
        toneOn = false;
      } else {
        tone(BUZZER_PIN, alarmFreq);
        toneOn = true;
      }
    } else {
      if (toneOn) {
        noTone(BUZZER_PIN);
        toneOn = false;
      } 
    }
  }
  
  // get sound voltage
  soundVoltage = analogRead(SOUND_SENSOR_PIN);
  if (soundVoltage > largestSoundVoltage) {
    largestSoundVoltage = soundVoltage;
  }

  if (mainCounter % 2000 == 0) {
    // every 2000 loops (~2s)
    db = dbRef + (soundSensitivity * (20 * log10((largestSoundVoltage / vRef))));
    Serial.print(db);
    Serial.println(" dB");
    largestSoundVoltage = 0;

    if (db > 110) {
      alarmOn = true;
    }
  }

  if (mainCounter % 5000 == 0) {
    // every 5000 loops (~5 seconds)
      
    /* Measure temperature and humidity.  If the functions returns
    true, then a measurement is available. */
    if (fetch_temp(&temperature, &humidity)) {
        Serial.print(temperature, 1);
        Serial.println(" °C");  
    }

    // update server 
    pCharacteristic->setValue(String(temperature) + "," + String(db));
  }

  // reset counter every 10000 loops (~10s)
  if (mainCounter >= 10000) {
    mainCounter = 0;
  }

  delay(1); // main loop clock speed: 1 ms
}
