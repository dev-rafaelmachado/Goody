import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";

import Hallo from "../components/Hallo";
import Menu from "../components/Menu";
import TempInfo from "../components/TempInfo";
import Door from "../components/Door.js";
import Ipcam from "../components/IPCam";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className={Style.dashboard}>
      <header className={Style.header}>
        <Hallo />
        <Menu logout={logout} />
      </header>
      <main className={Style.main}>
        <TempInfo />
        <Door />
        <Ipcam />
      </main>
    </div>
  );
};

export default Dashboard;
