import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";

import Hallo from "../components/Hallo";
import Menu from "../components/Menu";
import TempInfo from "../components/TempInfo";

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
      </main>
    </div>
  );
};

export default Dashboard;
