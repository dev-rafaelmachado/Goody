// Goody :: DEVELOP Version :: V_0.1

// > Bibliotecas
#include <WiFi.h>
#include <FirebaseESP32.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#include "DHT.h"

// > Defines
// # WIFI
#define WIFI_SSID "ALHN-4DAA"
#define WIFI_PASSWORD "RHOD7187"
// # Firebase
#define DATABASE_URL "https://goodyesp32-default-rtdb.firebaseio.com/"
#define API_KEY "AIzaSyAmCnM4buBLharowrBIe5qVONH8_1_L2RQ"
#define USER_EMAIL "adm@goody.com"
#define USER_PASSWORD "332211"
// # Pinos
// Sensores
#define pPIR 15   // ^ Pino PIR
#define pDHT 18   // ^ Pino DHT11
#define pMQ2 19   // ^ Pino MQ-2
#define pSM15 05  // ^ Pino SM-15
// ### reles
#define pRelePorta 13     // ^ Pino Rele (Porta)
#define pReleLuz 12       // ^ Pino Rele (Luz)
#define pReleExaustor 14  // ^ Pino Rele (Exaustor)
// ### Outros
#define intervaloDHT 20000

// > Vars
bool sPIR;  // ^ Status PIR

float vTemp;  // ^ Valor Temperatura
float vUmid;  // ^ Valor Umidade

unsigned long previousMillis_dht11;

// > Objetos
DHT dht(pDHT, DHT11);
FirebaseData fbdo;
FirebaseData fbdo_extra;
FirebaseAuth auth;
FirebaseConfig config;

// > Funções
// # Configs
// ~ Wifi Config
void wifiBegin() {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Conectando à rede Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Conectado à rede Wi-Fi com sucesso. Endereço IP: ");
  Serial.println(WiFi.localIP());
}

// ~ Firebase Config
void firebaseBegin() {
  Serial.printf("Firebase Client v%s\n\n", FIREBASE_CLIENT_VERSION);
  // .config
  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;
  config.token_status_callback = tokenStatusCallback;
  config.max_token_generation_retry = 5;
  auth.user.email = USER_EMAIL;
  auth.user.password = USER_PASSWORD;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // # Pegando o USER ID
  Serial.println("Getting User UID");
  while ((auth.token.uid) == "") {
    Serial.print('.');
    delay(1000);
  }
  String uid = auth.token.uid.c_str();
  Serial.print("User UID: ");
  Serial.println(uid);

  Serial.println("Conectado ao Firebase com sucesso!");
}

// # Others
// ~ Salva um valor float no Firebase
void setFloatValue(String path, float value) {
  if (Firebase.setFloat(fbdo, path + "/value", value)) {
    Serial.println(path + " [V]");
  } else {
    Serial.print(path + " [X]");
    Serial.println(fbdo.errorReason());
    if (Firebase.isTokenExpired()) {
      Firebase.refreshToken(&config);
      Serial.println("Refresh token");
    }
  }
}

// ~ Callback para quando a chave handdleOpen é alterada
void handleBooleanChange(StreamData data) {
  bool value = data.to<bool>();
  Serial.print("\n|>>>> handdleOpen:");
  Serial.println(value);

  // delay(2000);

  if (value) {
    if (Firebase.setBool(fbdo, "/room/components/door/handleopen", false)) {
      Serial.println("/room/components/door/handleopen [V]");
    } else {
      Serial.print("/room/components/door/handleopen [X]");
      Serial.println(fbdo.errorReason());
      if (Firebase.isTokenExpired()) {
        Firebase.refreshToken(&config);
        Serial.println("Refresh token");
      }
    }
  }
}

// ~ Quando a conexão http (webSocket) cai
void streamTimeoutCallback(bool timeout) {
  if (timeout) {
    Serial.println("Stream timeout, resume streaming...");
  }
  delay(1000);
}


// > Setup
void setup() {
  // # PinMode
  pinMode(pPIR, INPUT);
  pinMode(pReleLuz, OUTPUT);

  // Begins
  Serial.begin(9600);
  dht.begin();
  wifiBegin();
  firebaseBegin();


  // * Definindo Listener 
  if (!Firebase.beginStream(fbdo_extra, "/room/components/door/handleopen")) {
    Serial.println(fbdo.errorReason());
  }
  // * Definindo uma função de callback para quando uma chave for alterada
  Firebase.setStreamCallback(fbdo_extra, handleBooleanChange, streamTimeoutCallback);
      
  delay(1000);  // ! Estabilizar antes de começar
}

// > Loop
void loop() {
  unsigned long currentMillis = millis();

  // ? Lê o sensor PIR | Caso o valor seja HIGH (movimento) define o rele da luz como HIGH caso não possua movimento define o rele da luz como LOW
  sPIR = digitalRead(pPIR);
  digitalWrite(pReleLuz, sPIR);

  if ((unsigned long)(currentMillis - previousMillis_dht11) >= intervaloDHT) {
    // ? Lê o sensor DHT11 e Exibe as temperaturas e as grâva no Firebase
    vUmid = dht.readHumidity();
    vTemp = dht.readTemperature();
    Serial.println("Temperatura: " + String(vTemp) + " || Umidade: " + String(vUmid));
    if (Firebase.ready()) {
      setFloatValue("/room/components/dht11/temp", vTemp);  // * Grava Temperatura no Banco
      setFloatValue("/room/components/dht11/humd", vUmid);  // * Grava Umidade no Banco
    }
    previousMillis_dht11 = currentMillis;
  }
  delay(500);  // ! Desafogar
}
