// Goody :: DEVELOP Version :: V_0.1

// > Defines
#define pPIR_1 19 // ^ Pino PIR_1

// > Vars
bool sPIR_1; // ^ Status PIR_1

void setup() {
    Serial.begin(9600);
    pinMode(pPIR, INPUT);
}


void loop() {
    sPIR = digitalRead(pPIR);
    Serial.println(sPIR)
}
