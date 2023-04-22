    import { useState, useEffect } from "react";
    import { auth } from "../services/Firebase";
    import { onAuthStateChanged } from "firebase/auth";

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
        return <div>Verificando autenticação...</div>;
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
