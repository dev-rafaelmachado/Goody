import { useEffect } from "react";
import useAuth from "./hooks/useAuth";

function App() {
  const {redirect} = useAuth();

  useEffect(() => {
    redirect("/app");
  })
  

  return null
}

export default App;
