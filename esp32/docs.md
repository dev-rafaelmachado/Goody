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
* pMQ2 - Pino sensor MQ-2 -> 32
* pSM15 - Pino sensor SM15 -> 5
* pRelePorta - Pino Rele (Porta) -> 13
* pReleLuz - Pino Rele (Luz) -> 12
* pReleExaustor - Pino Rele (Exaustor) -> 14
#### Outros
* WIFI_SSID - Nome do WIFI para se conectar
* WIFI_PASSWORD - Senha do WIFI para se conectar
* DATABASE_URL - URL para conexão com o Firebase
* API_KEY - Chave de acesso para comunicação com o Firebase
* USER_EMAIL - Email para autenticação com o Firebase
* USER_PASSWORD - Senha para autenticação com o Firebase
* intervaloDHT - Intervalo entre uma leitura e outra do DHT11
* intervaloSM15 - Intervalo entre uma leitura e outra do SM15
* vAlertMQ2 - Valor máximo do sensor MQ-2 antes de mostrar o alerta

--

### Variables
* sPIR - (bool) Status do sensor PIR | controle do estado do sensor
* AlertFlag - (bool) Flag pata saber se existe um alerta aberto do MQ-2
* vMQ2 - Valor obtido atravês da leitura do MQ-2
* sTemp - (float) Valor obtido atravês da leitura do DHT11 
* sTemp - (float) Valor obtido atravês da leitura do DHT11 
* previousMillis_dht11 - (long) Tempo da leitura anterior do DHT11
* previousMillis_sm15 - (long) Tempo da leitura anterior do SM15


--

### Objetos
* dht - objeto da classe DHT da bliblioteca dht.h que possui as funções de leitura do sensor | (constructor: pDHT, DHT11 <- (modelo))
* fbdo - objeto da classe FirebaseData da biblioteca FirebaseESP32.h possui as informações de conexão com o firebase.
* fbdo_extra - objeto da classe FirebaseData da biblioteca FirebaseESP32.h *EXTRS* assim podendo fazer 2 operações ao mesmo tempo.
* auth - objeto da classe FirebaseAuth da biblioteca FirebaseESP32.h possui as informações de autenticação com o firebase.
* config - objeto da classe FirebaseConfig da biblioteca FirebaseESP32.h possui as configurações da comunicação do firebase com o esp32.
* json - Objeto da classe FirebaseJson que possui as funções de montagem de um json para o firebase

--

## Setup
### PinMode
* pPIR -> INPUT
* pSM15 -> INPUT
* pReleLuz -> OUTPUT
* pRelePorta -> OUTPUT
* pReleExaustor -> OUTPUT
### Configurações
* Serial.begin - Para iniciar o monitor serial
* dht.begin - Para iniciar o DHT11
#### Funções (shortcuts)
* wifiBegin - Configuração do WIFI | Se conecta na rede e exibe o ip que esta utilizando
* firebaseBegin - Configuração do Firebase | Configura as os links de chaves de conecção juntamento com os dados de autenticação; Inicia o Firebase e exibe o UID do usuário conectado (ADM)
#### Listeners
Define "ouvidos" para chaves do firebase, quando ocorre uma mudança nesta chave o código executa uma função de callback (handleBooleanChange).


## Funções 
* setFloatValue - Insere um valor float em uma chave do Firebase | Parametros: path (caminho para chave), value (valor a ser inserido) | Caso a operação ocorra com sucesso ele exibe no monitor serial o path e um status; Caso ocorra um erro ele o exibe.

* setBoolValue Insere um valor booleano em uma chave do Firebase | Pamarametros: path (caminho para chave), value (valor a ser inserido) | Caso a operação ocorra com sucesso ele exibe no monitor serial o path e um status; Caso ocorra um erro ele o exibe.

* openNotification Insere uma nova notificação no Firebase | Parametros: type (Tipo de notificação) | Caso a operação for bem sucedida ele exibe no monitor serial uma mensagem de status ok; caso ocorra um erro ele o exibe.

* handleBooleanChange - Função de callback que é chamada quando uma chave dos listerners é alterada. | data (StramData)  |  Ele mostra no monitor serial o valor e caso ele for positivo ele liga o rele da porta por 2 segundos e depois o desliga e grava no banco > false.

* streamTimeoutCallback - QUando a conexãe webSocket cai ele mostra uma mensagem e tenta se reconectar

## Loop
--
1) Inicia o loop verificando o tempo atual (millis)
--
2) Lê o Sensor PIR para se caso o seu valor seja HIGH (Dectectou movimento), ele ira ligar o rele da lampada, caso o seu valor seja LOW ele ira desligar o rele da lampada.
--
3) Lê o sensor MQ-2 e exibe o seu valor; faz uma verificação para caso o seu valor seja acima do vAlertMQ2 e ainda não possua um alerta: liga o rele do exaustor e abre uma notificação de alerta; caso o valor seja abaixo do vAlertMQ2 ele veririfica se existe um alerta aberto caso exista: fecha o alerta e a notificação e desliga o exaustor.
--
4) Verifica se já esta na hora de ler o sensor DHT11 ((Tempo atual - tempo da ultima leitura) >= Intervaloe entre uma leitura e outra (intervaloDHT)):
    Lê o sensor DHT11, Exibe as temperaturas no monitor serial e as grâva no Firebase; Define o tempo da ultima leitura (previousMillis_dht11) como o tempo atual.
--
5) Verifica se já esta na hora de ler o sensor SM15 ((Tempo atual - tempo da ultima leitura) >= Intervaloe entre uma leitura e outra (intervaloSM15)):
    Veficia se o estado atual do sensor é diferente do ultimo estado, caso seja:
        Altera o estado para o estado lido, mostra este valor no monitor serial e grava este valor no Firevase.
     Define o tempo da ultima leitura (previousMillis_sm15) como o tempo atual.
--
end) delay(500) - "Desafogar" o ESP32 possui 2 nucleos, sendo que 1 é responsavel por executar o código carregado e o outra fazer as operações WIFI (TCP/IP); ao colocar este delay o esp32 pode focar sua memoria em fazer as operações do segundo nucleo assim "desafogando" o esp32.