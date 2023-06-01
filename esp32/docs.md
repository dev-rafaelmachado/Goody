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
* pDHT - Pino sensor DHT11 -> 18
* pMQ2 - Pino sensor MQ-2 -> 35
* pSM15 - Pino sensor SM15 -> 33
* pACS712 - Pino sensor ACS712 -> 34
* pRelePorta - Pino Rele (Porta) -> 13
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
* intervaloACS712 - Intervalo entre uma leitura e outra do ACS712
* intervaloAlert - Intervalo entre gerar uma notificação e outra
* vAlertMQ2 - Valor máximo do sensor MQ-2 antes de mostrar o alerta
* umPorCento - 1% de 4096 (aprox)
* vAmpON - Valor em amperagem para considerar uma máquina ligada

--

### Variables
* sSM15 - (bool) Status do sensor SM15 | controle do estado da maquina
* AlertFlag_MQ2 - (bool) Flag para saber se existe um alerta aberto do MQ-2
* AlertFlag_DHT - (bool) Flag para saber se existe um alerta aberto no DHT (Tempertura)
* vMQ2 - (int) Valor obtido atravês da leitura do MQ-2
* vMvACS712Q2 - (int) Valor obtido atravês da leitura do ACS712
* sTemp - (float) Valor obtido atravês da leitura do DHT11 
* sTemp - (float) Valor obtido atravês da leitura do DHT11 
* Voltage - (float) Calculo da voltagem 
* Current - (float) Calculo da amperagem  
* previousMillis_dht11 - (long) Tempo da leitura anterior do DHT11
* previousMillis_sm15 - (long) Tempo da leitura anterior do SM15
* previousMillis_alertMQ2 - (long) Tempo da leitura anterior do tMQ2
* previousMillis_acs712 - (long) Tempo da leitura anterior do ACS712


--

### Objetos
* dht - objeto da classe DHT da bliblioteca dht.h que possui as funções de leitura do sensor | (constructor: pDHT, DHT11 <- (modelo))
* fbdo - objeto da classe FirebaseData da biblioteca FirebaseESP32.h possui as informações de conexão com o firebase.
* fbdo_extra - objeto da classe FirebaseData da biblioteca FirebaseESP32.h *EXTRS* assim podendo fazer 2 operações ao mesmo tempo.
* auth - objeto da classe FirebaseAuth da biblioteca FirebaseESP32.h possui as informações de autenticação com o firebase.
* config - objeto da classe FirebaseConfig da biblioteca FirebaseESP32.h possui as configurações da comunicação do firebase com o esp32.
* json - Objeto da classe FirebaseJson que possui as funções de montagem de um json para o firebase
* ntpUDP - Conexão UDP 
* NTPClient - Cliente para pegar dados do relogio mundial

--

## Setup
### PinMode
* pSM15 -> INPUT
* pMQ2 -> INPUT
* pACS712 -> INPUT
* pRelePorta -> OUTPUT
* pReleExaustor -> OUTPUT
### Configurações
* Serial.begin - Para iniciar o monitor serial
* dht.begin - Para iniciar o DHT11
#### Funções (shortcuts)
* wifiBegin - Configuração do WIFI | Se conecta na rede e exibe o ip que esta utilizando
* firebaseBegin - Configuração do Firebase | Configura as os links de chaves de conecção juntamento com os dados de autenticação; Inicia o Firebase e exibe o UID do usuário conectado (ADM)
* beginDateTime - configuração relogio | Congifuração do relogio para o fuso horario brasileiro
#### Listeners
Define "ouvidos" para chaves do firebase, quando ocorre uma mudança nesta chave o código executa uma função de callback (handleBooleanChange).


## Funções 
* setFloatValue - Insere um valor float em uma chave do Firebase | Parametros: path (caminho para chave), value (valor a ser inserido) | Caso a operação ocorra com sucesso ele exibe no monitor serial o path e um status; Caso ocorra um erro ele o exibe.

* setBoolValue Insere um valor booleano em uma chave do Firebase | Pamarametros: path (caminho para chave), value (valor a ser inserido) | Caso a operação ocorra com sucesso ele exibe no monitor serial o path e um status; Caso ocorra um erro ele o exibe.

* openNotification Insere uma nova notificação no Firebase | Parametros: type (Tipo de notificação) | Caso a operação for bem sucedida ele exibe no monitor serial uma mensagem de status ok; caso ocorra um erro ele o exibe.

* getFormatDateTime Retorna uma data formatada em string, padrão >> hh:mm:ss (dd/mm)

* handleBooleanChange - Função de callback que é chamada quando uma chave dos listerners é alterada. | data (StramData)  |  Ele mostra no monitor serial o valor e caso ele for positivo ele liga o rele da porta por 2 segundos e depois o desliga e grava no banco > false.

* streamTimeoutCallback - QUando a conexãe webSocket cai ele mostra uma mensagem e tenta se reconectar

## Loop
1) Inicia o loop verificando o tempo atual (millis)

--

2) Caso exista algum alerta aberto o exaustor deve ser ligado, do contrário desligue

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

6) Verifica se já esta na hora de ler o sensor ACS712
    Lê o sensor e calcula voltagem e amperagem; caso o valor seja acima do considerado "ligado" e o seu ultimo estado é false: troca o seu estado e grava no firebase, caso não seja acima do considerado "ligado" e seu utlimo estado é ligado: troca seu estado e grava no firebase.

--

end) delay(500) - "Desafogar" o ESP32 possui 2 nucleos, sendo que 1 é responsavel por executar o código carregado e o outra fazer as operações WIFI (TCP/IP); ao colocar este delay o esp32 pode focar sua memoria em fazer as operações do segundo nucleo assim "desafogando" o esp32.