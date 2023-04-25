import Style from "../css/pages/dashboard.module.css";

import useAuth from "../hooks/useAuth";

import Hallo from "../components/Hallo";
import Menu from "../components/Menu";

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div className={Style.dashboard}>
      <header className={Style.header}>
        <Hallo />
        <Menu logout={logout} />
      </header>
    </div>
  );
};

export default Dashboard;
