
import { useEffect, useState } from "react";
import useAuth from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { redirect, login } = useAuth();

  useEffect(() => {
    redirect("/login")
  });

  const handleLogin = (event) => {
    event.preventDefault();
    login(email,password)
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
