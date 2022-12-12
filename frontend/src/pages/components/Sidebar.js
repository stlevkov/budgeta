import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
  sidebarMainLinkList,
  sidebarSecondLinkList,
} from "../components/SidebarLinkList";

const Sidebar = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "sidebarWidth",
})(({ theme, open, sidebarWidth }) => ({
  // open is true
  "& .MuiDrawer-paper": {
    width: sidebarWidth,
    height: "100vh",
    position: "relative",
    whiteSpace: "nowrap",
    flexSrink: 0,
    boxSizing: "border-box",
    [theme.breakpoints.down("lg")]: {
      width: `calc(${theme.spacing(7)} + 1px)`,
      overflowX: "hidden",
    },
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!open && {
      width: `calc(${theme.spacing(7)} + 1px)`,
      overflowX: "hidden",
      [theme.breakpoints.down("lg")]: {
        width: sidebarWidth,
      },
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    }),
  },
}));

export default function SideBar({ open, toggleSidebar, sidebarWidth }) {
  return (
    <Sidebar
      variant="permanent"
      open={open}
      sidebarWidth={sidebarWidth}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          onClick={toggleSidebar}
          sx={(theme) => ({
            [theme.breakpoints.down("lg")]: {
              display: "none",
              ...(open && { display: "block" }),
              ...(!open && { display: "block" }),
            },
            ...(!open && { display: "none" }),
          })}
        >
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {sidebarMainLinkList}
        <Divider sx={{ my: 1 }} />
        {sidebarSecondLinkList}
      </List>
    </Sidebar>
  );
}
