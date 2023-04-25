import Style from "../css/components/door.module.css";
import { Door as DoorIcon, DoorOpen } from "@phosphor-icons/react";
import useFirebaseValue from "../hooks/useFirebaseValue";
import { ref, set } from "firebase/database";
import { db } from "../services/Firebase";

const Door = () => {
  const statusDoor = useFirebaseValue("/room/components/door/isopen");

  function handdleOpenDoor() {
    set(ref(db, "/room/components/door/handleopen"), true);
  }

  return (
    <div className={Style.box}>
      <div className={Style.status}>
        {statusDoor !== true ? (
          <>
            <DoorIcon size={"4.5rem"} color="#FF4B4B" /> <h4>Fechada</h4>
          </>
        ) : (
          <>
            <DoorOpen size={"4.5rem"} color="#A8FF7E" /> <h4>Aberta</h4>
          </>
        )}
      </div>

      {statusDoor !== true ? (
        <div onClick={handdleOpenDoor} className={Style.open}>
          <DoorOpen size={"4rem"} color="#fcfcfc" weight="fill" />{" "}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Door;
