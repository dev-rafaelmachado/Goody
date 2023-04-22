import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

const SetTheme = () => {
  const { toggleTheme } = useContext(ThemeContext);
  return <div><button onClick={toggleTheme}>Toggle Theme</button></div>;
};

export default SetTheme;
