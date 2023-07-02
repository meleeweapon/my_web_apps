import React, { useContext } from "react";

const ThemeContext = React.createContext("light");

const ThemeButton = () => {
  const theme = useContext(ThemeContext);

  return <button>{theme}</button>;
}

export default ThemeButton;