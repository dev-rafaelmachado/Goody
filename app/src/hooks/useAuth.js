import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

function useAuth() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const auth = getAuth();

  const redirect = (actualPath) => {
    if (currentUser === null && actualPath !== "/login") {
      navigate("/login");
    } else if (currentUser !== null && actualPath !== "/dashboard") {
      navigate("/dashboard");
    }
    
    
  };

  const login = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = () => {
    signOut(auth)
      .catch((error) => {
        console.error(error)
      });
  };  

  return { redirect, login, logout };
}

export default useAuth;
