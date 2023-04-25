import { useState, useEffect } from "react";
import { auth } from "../services/Firebase";
import { onAuthStateChanged } from "firebase/auth";

import { createContext } from "react";
import Loader from "../components/Loader";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  // Renderiza o contexto com o usuário atual e a função de redirecionamento
  const contextValue = {
    currentUser,
  };
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
