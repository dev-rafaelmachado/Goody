import Style from "../../css/components/machine.module.css";
import { Gear } from "@phosphor-icons/react";
import useFirebaseValue from "../../hooks/useFirebaseValue";

const Machine = ({ id }) => {
  const ison = useFirebaseValue(`/room/components/machines/${id}/ison`);
  return (
    <div className={`${Style.box} ${ison !== true ? Style.off : Style.on}`}>
      <Gear size={"2.4rem"} weight="fill" />
      <h2>Máquina {id[3]}</h2>
      <h4>
        Status: <span>{ison !== true ? "OFF" : "ON"}</span>
      </h4>
    </div>
  );
};

export default Machine;
