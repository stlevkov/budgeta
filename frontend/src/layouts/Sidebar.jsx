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
} from "./SidebarLinkList";

const Sidebar = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "sidebarWidth",
})(({ theme, open, sidebarWidth }) => ({
  // open is true by default
  width: sidebarWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(!open && {
    width: `-${sidebarWidth}`,
    marginLeft: theme.spacing(7),
  }),
  "& .MuiDrawer-paper": {
    width: sidebarWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    ...(!open && {
      overflowX: "hidden",
      width: theme.spacing(7),
      [theme.breakpoints.down("lg")]: {
        width: theme.spacing(7),
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
      anchor="left"
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
          paddingLeft: "1em",
          paddingRight: "1em",
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
