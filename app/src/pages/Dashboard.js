import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";

import Hallo from "../components/header/Hallo";
import Menu from "../components/header/Menu";
import Door from "../components/modules/Door";
import TempInfo from "../components/modules/TempInfo";
import Ipcam from "../components/modules/IPCam";
import ListMachines from "../components/modules/ListMachines";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className={Style.dashboard}>
      <header className={Style.header}>
        <Hallo />
        <Menu logout={logout} />
      </header>
      <main className={Style.main}>
      <div className={Style.divisor_1}>
        <TempInfo />
        <Door />
        <Ipcam />
      </div>
        <div className={Style.divisor_2}>
          <ListMachines />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
