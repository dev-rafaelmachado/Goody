import Style from "../../css/components/menu.module.css";

import { useState } from "react";
import { List, SignOut } from "@phosphor-icons/react";
import SetTheme from "../SetTheme";

const Menu = ({logout}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={Style.dropdown_menu}>
      <List
        size={36}
        className={Style.menu}
        onClick={() => {
          setIsMenuOpen(!isMenuOpen);
        }}
      />
      {isMenuOpen && (
        <ul>
          <span className={Style.toggle}><SetTheme /></span>
          <span onClick={logout} className={Style.out}> <SignOut size={32} weight="fill" /> Logout</span>
        </ul>
      )}
    </div>
  );
};

export default Menu;
