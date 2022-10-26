import React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import SettingsIcon from "@mui/icons-material/Settings";
import CircleIcon from "@mui/icons-material/Circle";
import { grey } from "@mui/material/colors";

export default function SettingsButton() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ ml: 2 }}
        aria-controls={open ? "settings-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="settings-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            background: grey[900],
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
        <List>
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                <CircleIcon />
              </IconButton>
            }
          >
            <ListItemText>Theme</ListItemText>
          </ListItem>
          <Divider />
          <ListItem
            secondaryAction={
              <IconButton edge="end" aria-label="delete">
                $
              </IconButton>
            }
          >
            <ListItemText>Currency</ListItemText>
          </ListItem>
        </List>
      </Menu>
    </div>
  );
}
