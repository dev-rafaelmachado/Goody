import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";
import useFirebaseValue from "../hooks/useFirebaseValue";

import Hallo from "../components/Hallo";
import Menu from "../components/Menu";

const Dashboard = () => {
  const { logout } = useAuth();
  const value = useFirebaseValue("room/components/bme280/humd/value");

  return (
    <div className={Style.dashboard}>
      <header className={Style.header}>
        <Hallo />
        <Menu logout={logout} />
      </header>
      <div>Teste: {value} </div>
    </div>
  );
};

export default Dashboard;
