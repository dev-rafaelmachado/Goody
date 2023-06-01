import { useState } from "react";
import Style from "../../css/components/notification.module.css";

import {
  BellSimple,
  CaretLeft,
  FireSimple,
  ThermometerHot,
  XCircle,
} from "@phosphor-icons/react";
import useFirebaseValue from "../../hooks/useFirebaseValue";

import { ref, set, remove } from "firebase/database";
import { db } from "../../services/Firebase";

const Notification = () => {
  const notifTemplate = {
    fire: [
      <FireSimple size={"3rem"} weight="fill" />,
      "Principio de fogo",
      "foi registrado um pico no sensor de fumaça.",
    ],
    temp: [
      <ThermometerHot size={"3rem"} weight="fill" />,
      "Alta Temperatura",
      "foi registrado um pico no sensor de temperatura.",
    ],
  };
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const dataNotif = useFirebaseValue("/room/notifications");

  const handleNotifBox = () => {
    if (isNotifOpen) {
      for (const key in dataNotif) {
        handleViewed(key);
      }
    }
    setIsNotifOpen(!isNotifOpen);
  };

  const handleViewed = (key) => {
    set(ref(db, `/room/notifications/${key}/isviewed`), true);
  };

  const removeNotf = (key) => {
    remove(ref(db, `/room/notifications/${key}`))
      .then(() => {})
      .catch((error) => {
        console.error("Erro ao remover coleção: ", error);
      });
  };

  return (
    <div className={Style.box}>
      <BellSimple
        className={Style.bell}
        size={"3rem"}
        weight="fill"
        onClick={handleNotifBox}
      />
      {isNotifOpen && (
        <ul>
          <CaretLeft
            onClick={handleNotifBox}
            className={Style.arrow}
            color="#fff"
          />
          <h1>Notificações</h1>
          {dataNotif &&
            Object.keys(dataNotif).map((key) => {
              return (
                <div className={Style.notif_block} key={key}>
                  {notifTemplate[dataNotif[key]["type"]][0]}
                  <div>
                    <h2>{notifTemplate[dataNotif[key]["type"]][1]}</h2>
                    <p>
                      As {dataNotif[key]["time"]}{" "}
                      {notifTemplate[dataNotif[key]["type"]][2]}
                    </p>
                    {dataNotif[key]["isviewed"] === false && (
                      <div className={Style.noviewed}></div>
                    )}
                    <XCircle
                      onClick={() => {
                        removeNotf(key);
                      }}
                      className={Style.X}
                      size={"1.4rem"}
                      color="#fcfcfc"
                    />
                  </div>
                </div>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default Notification;
