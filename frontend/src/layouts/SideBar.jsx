import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined"

export default function SideNavBar() {
    const { collapseSidebar } = useProSidebar();
    return (
        <div id="app" className="App" style={({ height: "120vh" }, { display: "flex" })} >
        <Sidebar style={{ border: 'none', paddingRight: '6px'}} backgroundColor={'#1A2027'} >
        <Menu menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0) {
                return {
                  color: disabled ? "#eee" : "#455A64",
                  backgroundColor: active ? "#fff" : undefined,
                  "&:hover": {
                     backgroundColor: "#335B8C !important",
                     color: "white !important",
                     borderRadius: "8px !important",
                     fontWeight: "bold !important"
                   },
                };
              }
            },
          }}>
          <MenuItem className="Menu-Item" style={{ textAlign: "center" }} icon={<MenuOutlinedIcon />}
            onClick={() => {
              collapseSidebar();
            }}>
            {" "}
            <h2>Budgeta</h2>
          </MenuItem>
          <MenuItem icon={<HomeOutlinedIcon />}>Home</MenuItem>
          <MenuItem icon={<PeopleOutlinedIcon />}>Team</MenuItem>
          <MenuItem icon={<ContactsOutlinedIcon />}>Contacts</MenuItem>
          <MenuItem icon={<ReceiptOutlinedIcon />}>Profile</MenuItem>
          <MenuItem icon={<HelpOutlineOutlinedIcon />}>FAQ</MenuItem>
          <MenuItem icon={<CalendarTodayOutlinedIcon />}>Calendar</MenuItem>
        </Menu>
      </Sidebar>
      </div>
    );
}