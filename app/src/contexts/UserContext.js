import { useState, useEffect } from "react";
import { auth } from "../services/Firebase";
import { onAuthStateChanged  } from "firebase/auth";

import { createContext } from "react";
const AuthContext = createContext();

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  if (!isAuthChecked) {
    // Ainda não verificou o estado de autenticação.
    // Você pode mostrar um componente de carregamento aqui.
    return <div>Verificando autenticação...</div>
  }

  // A verificação do estado de autenticação foi concluída.
  // Renderiza o contexto com o usuário atual.
  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
