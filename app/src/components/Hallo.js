import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

import Style from "../css/components/hallo.module.css";

const Hallo = () => {
  const { currentUser } = useContext(AuthContext);
  const dataAtual = new Date();
  const nomesMeses = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const dia = dataAtual.getDate();
  const mes = nomesMeses[dataAtual.getMonth()];
  const ano = dataAtual.getFullYear();
  const name =
    currentUser["email"].split("@")[0].charAt(0).toUpperCase() +
    currentUser["email"].split("@")[0].slice(1);
  return (
    <div className={Style.hallo}>
      <h1>
        Olá, <span className={Style.name}>{name}</span>
      </h1>
      <p>
        Hoje {dia} de {mes} {ano}
      </p>
    </div>
  );
};

export default Hallo;
