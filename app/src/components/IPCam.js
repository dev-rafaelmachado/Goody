import Style from "../css/components/ipcam.module.css";
import { Webcam } from "@phosphor-icons/react";

const Ipcam = () => {
  return (
    <div className={Style.box}>
      <Webcam size={"3rem"} color="#fcfcfc" weight="fill" />
      <h2>IP CAM</h2>
    </div>
  );
};

export default Ipcam;
