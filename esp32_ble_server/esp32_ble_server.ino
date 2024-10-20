#include <Arduino.h>
#include <math.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>
#include <DHT11.h>

// Peripherals pins
#define SOUND_SENSOR_PIN 34
#define GAS_SENSOR_PIN 35
#define TEMP_PIN 23
#define BUZZER_PIN 32
#define LED_PIN 22

DHT11 dht11(TEMP_PIN);

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
    Serial.begin(19200);
    setup_ble();
    pinMode(BUZZER_PIN, OUTPUT);
    pinMode(LED_PIN, OUTPUT);
}

int mainCounter = 0;

bool booting = true;
bool alarmOn = false;
bool toneOn = false;
int alarmFreq = 550;

int soundVoltage;
int largestSoundVoltage;
int soundSensitivity = 42;
float dbRef = 26.3;
float vRef = 884;
float db;

int gasVoltage;

int temperature;

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
  if (mainCounter % 150 == 0) {
    alarmBeep();
  }
  
  // get sound voltage
  soundVoltage = analogRead(SOUND_SENSOR_PIN);
  if (soundVoltage > largestSoundVoltage) {
    largestSoundVoltage = soundVoltage;
  }

  if (mainCounter % 2000 == 0) {
    db = dbRef + (soundSensitivity * (20 * log10((largestSoundVoltage / vRef))));
    if (db < 38) db = 31.14;
    if (db > 120) db = 120;
    largestSoundVoltage = 0;

    temperature = dht11.readTemperature();
    gasVoltage = analogRead(GAS_SENSOR_PIN);

    Serial.println(String(temperature) + "°c, " + String(db) + "db, " + String(gasVoltage));

    if (booting && (db > 120 || temperature > 35 || gasVoltage > 1000)) {
      alarmOn = true;
    }

    // update server 
    pCharacteristic->setValue(String(temperature) + "," + String(db) + "," + String(gasVoltage));
  }

  mainCounter++;
  // reset counter every 10000 loops (~10s)
  if (mainCounter >= 10000) {
    booting = false;
    mainCounter = 0;
  }

  delay(1); // main loop clock speed: 1 ms
}
