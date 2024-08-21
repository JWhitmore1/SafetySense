#include <Arduino.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include "DHT_Async.h"

// BLE Server UUID's
#define SERVICE_UUID        "8b712be9-e6cd-4356-b703-beca1b406f5c"
#define CHARACTERISTIC_UUID "137700a2-86a4-4f8f-8864-b1839db64ef6"

// Temp Sensor Setup
#define DHT_SENSOR_TYPE DHT_TYPE_11
static const int DHT_SENSOR_PIN = 23;
DHT_Async dht_sensor(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

BLECharacteristic *pCharacteristic;

void setup_ble() {
  Serial.println("---- Starting BLE Server ----");
  // device name
  BLEDevice::init("ESP32");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                                         CHARACTERISTIC_UUID,
                                         BLECharacteristic::PROPERTY_READ |
                                         BLECharacteristic::PROPERTY_WRITE
                                       );

  pCharacteristic->setValue("Test Value");
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


/*
 * Main program loop.
 */
void loop() {
    float temperature;
    float humidity;

    /* Measure temperature and humidity.  If the functions returns
       true, then a measurement is available. */
    if (fetch_temp(&temperature, &humidity)) {
        Serial.print("T = ");
        Serial.print(temperature, 1);
        Serial.print(" deg. C, H = ");
        Serial.print(humidity, 1);
        Serial.println("%");   
    }

    // update server 
    pCharacteristic->setValue(String(temperature) + "," + String(humidity));
    delay(5 * 1000); // 5 seconds
}
