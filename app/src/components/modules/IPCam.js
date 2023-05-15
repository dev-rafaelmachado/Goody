import Style from "../../css/components/ipcam.module.css";
import { Webcam } from "@phosphor-icons/react";

const Ipcam = () => {
  const openApp = () => {
    const intentURI =
      "intent://#Intent;scheme=br.com.intelbras.mibocam;package=br.com.intelbras.mibocam;end;";
    window.location.href = intentURI;
  };

  return (
    <div onClick={openApp} className={Style.box}>
      <Webcam size={"3rem"} color="#fcfcfc" weight="fill" />
      <h2>IP CAM</h2>
    </div>
  );
};

export default Ipcam;
