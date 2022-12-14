import * as React from "react";
import MuiAppBar from "@mui/material/AppBar";
import SettingsButton from "../../components/SettingsButton";
import InputTargetSaving from "../../components/dynamic/TargetSaving";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "sidebarWidth",
})(({ theme, open, sidebarWidth }) => ({
  // open is false
  zIndex: theme.zIndex.drawer + 1,
  position: "relative",
  width: `calc(100vw - ${sidebarWidth}px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.down("lg")]: {
      width: "100vw",
      marginLeft: `calc(0px - (${theme.spacing(7)} + 1px))`,
    },
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    width: "100vw",
    marginLeft: `calc(0px - (${theme.spacing(7)} + 1px))`,
    [theme.breakpoints.down("lg")]: {
      width: `calc(100vw - ${sidebarWidth}px)`,
      marginLeft: 0,
    },
  }),
}));

export default function NavBar({
  open,
  toggleSidebar,
  sidebarWidth,
  onTargetSaving,
}) {
  return (
    <Navbar open={open} sidebarWidth={sidebarWidth}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={toggleSidebar}
            sx={(theme) => ({
              [theme.breakpoints.down("lg")]: {
                display: "block",
                ...(!open && { display: "none" }),
              },
              ...(open && { display: "none" }),
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="span"
            sx={{
              display: {
                xs: "none",
                sm: "block",
                md: "block",
                lg: "block",
                xl: "block",
              },
              padding: "0.5em",
            }}
          >
            Dashboard
          </Typography>
        </Box>

        <Box sx={{ display: "flex" }}>
          <InputTargetSaving calculateCostAnalytics={onTargetSaving} />

          <Box sx={{ display: "flex" }}>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <SettingsButton />
          </Box>
        </Box>
      </Toolbar>
    </Navbar>
  );
}
