import React from "react";

import { styled, useTheme } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import { ColorModeContext } from "../App";

export default function ThemeSwitch() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);

  /* Temporary storing themeSwitch state in localStorage*/
  let checked =
    localStorage.getItem("themeSwitch") !== undefined &&
    localStorage.getItem("themeSwitch") !== null
      ? JSON.parse(localStorage.getItem("themeSwitch"))
      : false;

  const mutateTheme = () => {
    colorMode.toggleColorMode();

    const modeModified = theme.palette.mode !== "dark" ? "dark" : "light";

    modeModified !== "dark" ? (checked = true) : (checked = false);

    localStorage.setItem("themeSwitch", JSON.stringify(checked));
    localStorage.setItem("themeMode", modeModified);
  };

  const ThemeToggler = styled(Switch)(({ theme }) => ({
    padding: 6,
    width: "5rem",
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      position: "relative",
      opacity: "1 !important",
      backgroundColor: "#555",

      "&:before, &:after": {
        display: "block",
        position: "absolute",
        top: "50%",
        width: "50%",
        transform: "translateY(-50%)",
        textAlign: "center",
        margin: 0,
      },
      "&:before": {
        content: '"LIGHT"',
        left: 6,
        opacity: 0,
        fontSize: "0.6em",
      },
      "&:after": {
        content: '"DARK"',
        right: 6,
        fontSize: "0.6em",
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      width: 16,
      height: 16,
      margin: 2,
    },
    "& .Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#eee !important",
      border: "1px solid",
      color: "#222",
      "&:before": {
        opacity: 1,
      },
      "&:after": {
        opacity: 0,
      },
    },
    "& .Mui-checked .MuiSwitch-thumb": {
      backgroundColor: "#222",
      transform: "translate(1.3em)",
      margin: 3,
    },
  }));
  return <ThemeToggler checked={checked} onChange={mutateTheme} />;
}
