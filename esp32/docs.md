# Projeto: Goody
Plataforma: ESP32

---

### Components
*DHT11:*
* DHT11 - Sensor de temperatura e Umidade

*SM-15:*
* MAG - Sensor de magnetismo 

*MQ-2:*
* MQ - Sensor de fogo/fumaça/gás

*PIR:*
* PIR - Primiero PIR | resposável pelo controle da luz
  
*Reles*
* RL1 - Relé exaustor
* RL2 - Relé Luzes
* RL3 - Relé eletroímã porta


---

## </> Código 

## Header
### Defines Pinos
#### Pinos
* pPIR - Pino do sensor PIR -> 15
* pDHT - Pino sensor DHT11 -> 18
* pMQ2 - Pino sensor MQ-2 -> 19
* pSM15 - Pino sensor SM15 -> 5
* pRelePorta - Pino Rele (Porta) -> 13
* pReleLuz - Pino Rele (Luz) -> 12
* pReleExaustor - Pino Rele (Exaustor) -> 1
#### Outros
* WIFI_SSID - Nome do WIFI para se conectar
* WIFI_PASSWORD - Senha do WIFI para se conectar
* DATABASE_URL - URL para conexão com o Firebase
* API_KEY - Chave de acesso para comunicação com o Firebase
* USER_EMAIL - Email para autenticação com o Firebase
* USER_PASSWORD - Senha para autenticação com o Firebase

--

### Variables
* sPIR - (bool) Status do sensor PIR | controle do estado do sensor
* sTemp - (float) Valor da temperatura | Valor obtido atravês da leitura do DHT11 
* sTemp - (float) Valor da umidade | Valor obtido atravês da leitura do DHT11 

--

### Objetos
* dht - objeto da classe DHT da bliblioteca dht.h que possui as funções de leitura do sensor | (constructor: pDHT, DHT11 <- (modelo))
* fbdo - objeto da classe FirebaseData da biblioteca FirebaseESP32.h possui as informações de conexão com o firebase.
* auth - objeto da classe FirebaseAuth da biblioteca FirebaseESP32.h possui as informações de autenticação com o firebase.
* config - objeto da classe FirebaseConfig da biblioteca FirebaseESP32.h possui as configurações da comunicação do firebase com o esp32.

--

## Setup
### PinMode
* pPIR -> INPUT
* pRelePorta -> OUTPUT
### Configurações
* Serial.begin - Para iniciar o monitor serial
* dht.begin - Para iniciar o DHT11
#### Funções (shortcuts)
* wifiBegin - Configuração do WIFI | Se conecta na rede e exibe o ip que esta utilizando
* firebaseBegin - Configuração do Firebase | Configura as os links de chaves de conecção juntamento com os dados de autenticação; Inicia o Firebase e exibe o UID do usuário conectado (ADM)

## Funções 
* setFloatValue - Insere um valor float em uma chave do banco de dados | Parametros: path (caminho para chave), value (valor a ser inserido) | Caso a operação ocorra com sucesso ele exibe no monitor serial o path e um status; Caso ocorra um erro ele o exibe.

## Loop
