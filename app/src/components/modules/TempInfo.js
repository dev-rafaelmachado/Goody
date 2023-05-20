import Style from "../../css/components/tempinfo.module.css";
import { ThermometerSimple } from "@phosphor-icons/react";
import useFirebaseValue from "../../hooks/useFirebaseValue";
import { useEffect, useState } from "react";

const TempInfo = () => {
  // ~ Valores do firebase
  const vTemperature = useFirebaseValue("/room/components/dht11/temp/value");
  const vUmidade = useFirebaseValue("/room/components/dht11/humd/value");
  const vSmoke = useFirebaseValue("/room/components/mq-2/value");

  // ~ Outros States
  const [color, setColor] = useState("#fff");
  const [classification, setClassification] = useState("-----");

  useEffect(() => {
    if (vTemperature != null) {
      if (vTemperature < 14) {
        setColor("#5AF5FF");
        setClassification("Frio");
      } else if (vTemperature < 22) {
        setColor("#A3FF5A");
        setClassification("Ameno");
      } else if (vTemperature <= 26) {
        setColor("#FF825A");
        setClassification("Quente");
      } else {
        setColor("#FF5A5A");
        setClassification("Muito Quente");
      }
    }
  }, [vTemperature]);

  return (
    <div className={Style.box}>
      <div className={Style.temp_block}>
        <div className={Style.classification}>
          <ThermometerSimple size={"4rem"} color={color} weight="fill" />
          <h3>{classification}</h3>
        </div>
        <h4>{vTemperature != null ? vTemperature.toFixed(0) : "--"}º</h4>
      </div>
      <div className={Style.info_block}>
        <div className={Style.info}>
          <h6>{vUmidade != null ? vUmidade.toFixed(0) : "--"}%</h6>
          <p>Umidade</p>
        </div>
        <div className={Style.info}>
          <h6>{vSmoke != null ? ((vSmoke / 4096) * 100).toFixed(0) : "--"}%</h6>
          <p>Fumaça/Gás</p>
        </div>
      </div>
    </div>
  );
};

export default TempInfo;
