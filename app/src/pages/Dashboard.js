import { useEffect } from "react";
import useAuth from "../hooks/useAuth";
import SetTheme from "../components/SetTheme";

const Dashboard = () => {
  const {redirect, logout} = useAuth();

  useEffect(() => {
    redirect("/dashboard")
  });

  return <div>Dashboard
    <button onClick={logout}>Logout</button>
    <SetTheme />
  </div>;
};

export default Dashboard;
