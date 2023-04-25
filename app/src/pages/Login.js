import Style from "../css/pages/login.module.css"

import { useCallback, useEffect, useState } from "react";
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { redirect, login } = useAuth();

  const handleLogin = (event) => {
    event.preventDefault();
    login(email,password)
  };

  const memoizedRedirect = useCallback(redirect, []);

  useEffect(() => {
    memoizedRedirect("/login");
  },[memoizedRedirect]);

  return (
    <div className={Style.main}>
      <form className={Style.form} onSubmit={handleLogin}>
        <h1>Login</h1>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="E-mail"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Senha"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
