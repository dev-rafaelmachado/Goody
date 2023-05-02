import Style from "../css/components/menu.module.css";

import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { Moon, Sun } from "@phosphor-icons/react";


const SetTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className={Style.theme} onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon size={32} weight="fill" />
      ) : (
        <Sun size={32} weight="fill" />
      )}
      {theme === "dark" ? "Light" : "Dark"}
    </div>
  );
};

export default SetTheme;
