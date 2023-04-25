import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";


import Hallo from "../components/Hallo";
import Menu from "../components/Menu";

const Dashboard = () => {
  const { logout } = useAuth();
  const {data: value, isFetching} = useFetch("/room/components/machines")
  if(!isFetching){
    for (const mac in value) {
      console.log(value[mac].ison)
    }
  }

  return (
    <div className={Style.dashboard}>
      <header className={Style.header}>
        <Hallo />
        <Menu logout={logout} />
      </header>
      <div>Teste: {isFetching ? <p>Carregando...</p> : JSON.stringify(value)} </div>
    </div>
  );
};

export default Dashboard;
