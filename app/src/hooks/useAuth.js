import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../services/Firebase";

function useAuth() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const redirect = (actualPath) => {
    if (currentUser === null && actualPath !== "/login") {
      navigate("/login");
    } else if (currentUser !== null && actualPath !== "/dashboard") {
      navigate("/dashboard");
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };
  

  return { redirect, login, logout };
}

export default useAuth;
