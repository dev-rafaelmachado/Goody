import Style from "../css/pages/dashboard.module.css";

import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

import Hallo from "../components/Hallo";
import Menu from "../components/Menu";

const Dashboard = () => {
  const { redirect, logout } = useAuth();
  console.log("Carregando dashboard");

  useEffect(() => {
    console.log("Redirecionando");
    redirect("/dashboard");
  },[redirect,logout]);

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
