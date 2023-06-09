// Goody :: DEVELOP Version :: V_0.1

// > Bibliotecas
// Base
#include <WiFi.h>
// ## Firebase
#include <FirebaseESP32.h>
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
// Time
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>
// Sensors
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
#define pDHT 18     // ^ Pino DHT11
#define pMQ2 35     // ^ Pino MQ-2
#define pSM15 33    // ^ Pino SM-15
#define pACS712 34  // ^ Pino ACS712
// ### reles
#define pRelePorta 13     // ^ Pino Rele (Porta)
#define pReleExaustor 14  // ^ Pino Rele (Exaustor)
// ### Outros
#define intervaloDHT 20000
#define intervaloSM15 1000
#define intervaloACS712 1000

#define intervaloAlert 120000
#define vAlertMQ2 1024  // 25%
#define vAlertTemp 28   // 28ºC

#define umPorCento 46
#define vAmpON 5

// > Vars
bool sSM15;          // ^ Status SM15
bool sACS712;        // ^ Status ACS712
bool AlertFlag_MQ2;  // ^ Uma flag de alerta (MQ2)
bool AlertFlag_DHT;  // ^ Uma flag de alerta (MQ2)

int vMQ2;     // ^ Valor MQ2
int vACS712;  // ^ Valor ACS712

float vTemp;    // ^ Valor Temperatura
float vUmid;    // ^ Valor Umidade
float Voltage;  // ^ Voltagem
float Current;  // ^ Amperagem

unsigned long previousMillis_dht11;
unsigned long previousMillis_sm15;
unsigned long previousMillis_alertMQ2;
unsigned long previousMillis_acs712;

// > Objetos
DHT dht(pDHT, DHT11);
FirebaseData fbdo;
FirebaseData fbdo_extra;
FirebaseAuth auth;
FirebaseConfig config;
FirebaseJson json;

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

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

// ~ DateTime config
void beginDateTime() {
  timeClient.begin();
  timeClient.setTimeOffset(-10800);
  timeClient.update();
}

// # Others
// ~ Salva um valor float no Firebase
void setFloatValue(String path, float value) {
  if (Firebase.setFloat(fbdo, path + "/value", value)) {
    Serial.println(path + " [V]");
    Firebase.setString(fbdo, path + "/time", getFormatDateTime());
  } else {
    Serial.print(path + " [X]");
    Serial.println(fbdo.errorReason());
    if (Firebase.isTokenExpired()) {
      Firebase.refreshToken(&config);
      Serial.println("Refresh token");
    }
  }
}

// ~ Salva um valor bool no Firebase
void setBoolValue(String path, bool value) {
  if (Firebase.setBool(fbdo, path, value)) {
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

// ~ Abre uma notificação
void openNotification(String type) {
  // * Cria um json com todas as informações da notificação
  json.clear();
  json.set("type", type);
  json.set("isviewed", false);
  json.set("time", getFormatDateTime());
  if (Firebase.pushJSON(fbdo, "/room/notifications/", json)) {
    Serial.println("Notificação gravada [v]");
  } else {
    Serial.print("Notificação - Erro ao gravar [x] | ");
    Serial.println(fbdo.errorReason());
  }
}

// ~ Retorna data formatada
String getFormatDateTime() {
  timeClient.update();
  time_t currentTime = timeClient.getEpochTime();
  struct tm *timeinfo;
  timeinfo = localtime(&currentTime);

  int currentYear = timeinfo->tm_year + 1900;
  int currentMonth = timeinfo->tm_mon + 1;
  int currentDay = timeinfo->tm_mday;
  int currentHour = timeinfo->tm_hour;
  int currentMinute = timeinfo->tm_min;
  int currentSecond = timeinfo->tm_sec;
  return (String(currentHour) + ":" + String(currentMinute) + ":" + String(currentSecond) + " (" + String(currentDay) + "/" + String(currentMonth) + ")");
}

// ------------------ //

// ~ Callback para quando a chave handdleOpen é alterada
void handleBooleanChange(StreamData data) {
  bool value = data.to<bool>();
  Serial.print("\n|>>>> handdleOpen:");
  Serial.println(value + "\n");

  if (value) {
    digitalWrite(pRelePorta, HIGH);
    delay(2000);
    digitalWrite(pRelePorta, LOW);
    setBoolValue("/room/components/door/handleopen", false);
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
  pinMode(pSM15, INPUT);
  pinMode(pMQ2, INPUT);
  pinMode(pACS712, INPUT);
  pinMode(pRelePorta, OUTPUT);
  pinMode(pReleExaustor, OUTPUT);

  // Begins
  Serial.begin(9600);

  dht.begin();
  wifiBegin();
  firebaseBegin();
  beginDateTime();

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
  // ? Caso exista algum alerta aberto o exaustor deve ser ligado, do contrário desligue
  if (AlertFlag_MQ2 || AlertFlag_DHT)
    digitalWrite(pReleExaustor, 1);
  else
    digitalWrite(pReleExaustor, 0);

  // * lê o MQ2 e exibe seu valor no Serial somente caso a diferença for maior que 1% da leitura passada
  if (abs(analogRead(pMQ2) - vMQ2) >= umPorCento) {
    vMQ2 = analogRead(pMQ2);
    Serial.println("MQ2 - Valor: " + String(vMQ2));
    setFloatValue("/room/components/mq-2", float(vMQ2));
    // ? Caso o valor medido for maior que o valor de alerta: Ative o alerta e ligue o exaustor
    if (vMQ2 >= vAlertMQ2 && !AlertFlag_MQ2 && (unsigned long)(currentMillis - previousMillis_alertMQ2) >= intervaloAlert) {
      Serial.println("ALERTA!!!! Sensor MQ2 Detectou um pico na leitura");
      AlertFlag_MQ2 = true;
      openNotification("fire");
    }
    // ? Caso o valor medido não for maior que o valor de alerta: Verifique se existe um Alerta aberto: Feche o alerta
    else if (vMQ2 <= vAlertMQ2 && AlertFlag_MQ2) {
      Serial.println("Alerta Sensor MQ2 - Fechado");
      AlertFlag_MQ2 = false;
      currentMillis = previousMillis_alertMQ2;
    }
  }

  // ? Verifica se já esta na hora de ler o sensor DHT11
  if ((unsigned long)(currentMillis - previousMillis_dht11) >= intervaloDHT) {
    vUmid = dht.readHumidity();
    vTemp = dht.readTemperature();
    // ? Lê o sensor DHT11 e Exibe as temperaturas e as grâva no Firebase
    Serial.println("Temperatura: " + String(vTemp) + " || Umidade: " + String(vUmid));
    if (Firebase.ready()) {
      setFloatValue("/room/components/dht11/temp", vTemp);  // * Grava Temperatura no Banco
      setFloatValue("/room/components/dht11/humd", vUmid);  // * Grava Umidade no Banco
    }
    if (vTemp >= vAlertTemp) {
      Serial.println("ALERTA!!!! Sensor DHT Detectou um pico na leitura");
      AlertFlag_DHT = true;
      openNotification("temp");
    } else if (vTemp <= vAlertTemp && AlertFlag_DHT) {
      Serial.println("Alerta Sensor DHT - Fechado");
      AlertFlag_DHT = false;
    }
    previousMillis_dht11 = currentMillis;
  }

  // ? Verifica se já esta na hora de ler o sensor SM15
  if ((unsigned long)(currentMillis - previousMillis_sm15) >= intervaloSM15) {
    // ? Veficia se o estado atual do sensor é diferente do ultimo estado
    if (digitalRead(pSM15) != sSM15) {
      // * Altera o estado e grava no firebase
      sSM15 = digitalRead(pSM15);
      Serial.println("Porta: " + String(!sSM15));
      setBoolValue("/room/components/door/isopen", !sSM15);
    }
    previousMillis_sm15 = currentMillis;
  }

  // ?
  if ((unsigned long)(currentMillis - previousMillis_acs712) >= intervaloACS712) {
    vACS712 = analogRead(pACS712);
    Voltage = (vACS712 * 3.3) / 4096.0;
    Current = (Voltage - 2.5) / 0.100;

    if (Current >= vAmpON && !sACS712) {
      sACS712 = true;
      Serial.println("Máquina 1 - Ligada");
      setBoolValue("/room/components/machines/mac1/ison", sACS712);
    } else if (sACS712) {
      sACS712 = false;
      Serial.println("Máquina 1 - Desligada");
      setBoolValue("/room/components/machines/mac1/ison", sACS712);
    }
    previousMillis_acs712 = currentMillis;
  }

  delay(500);  // ! Desafogar
}
