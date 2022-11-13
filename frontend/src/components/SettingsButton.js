import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SettingsIcon from "@mui/icons-material/Settings";
import ThemeSwitch from "./ThemeSwitch";

export default function SettingsButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleSettingsOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorEl(null);
  };

  const settingsMenuId = "settings-menu";
  const renderMobileMenu = (
    <Menu
      anchorEl={anchorEl}
      id={settingsMenuId}
      open={isMenuOpen}
      onClose={handleSettingClose}
      PaperProps={{
        elevation: 0,
        sx: {
          background: "primary",
          border: "1px solid darkgrey",
          width: 210,
          overflow: "visible",
          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
          marginTop: "1.2em",
          "&:before": {
            content: '""',
            display: "block",
            position: "absolute",
            top: 0,
            right: 12,
            width: 12,
            height: 12,
            transform: "translateY(-50%) rotate(45deg)",
            zIndex: 0,
          },
        },
      }}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <List
        sx={{
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <ListItem
          secondaryAction={<ThemeSwitch edge="end" aria-label="theme-switch" />}
        >
          <ListItemText>Theme</ListItemText>
        </ListItem>
        <Divider />

        {/* Currency */}
        <ListItem
          secondaryAction={
            <IconButton size="small" edge="end" aria-label="currency">
              USD
            </IconButton>
          }
        >
          <ListItemText>Currency</ListItemText>
        </ListItem>
      </List>
    </Menu>
  );

  return (
    <div>
      <IconButton
        size="large"
        onClick={handleSettingsOpen}
        aria-controls={isMenuOpen ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? "true" : undefined}
      >
        <SettingsIcon />
      </IconButton>
      {renderMobileMenu}
    </div>
  );
}
