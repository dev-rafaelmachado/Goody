import Style from "../../css/components/ipcam.module.css";
import { Webcam } from "@phosphor-icons/react";

const Ipcam = () => {
  const openApp = () => {
    window.location.href =
      "https://play.google.com/store/apps/details?id=br.com.intelbras.mibocam&hl=en_US";
  };

  return (
    <div onClick={openApp} className={Style.box}>
      <Webcam size={"3rem"} color="#fcfcfc" weight="fill" />
      <h2>IP CAM</h2>
    </div>
  );
};

export default Ipcam;
