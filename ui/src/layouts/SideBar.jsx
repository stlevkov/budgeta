import React, { useState, useEffect, useContext } from 'react';
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CalendarDialog from '../components/dialogs/CalendarDialog';

import { CalendarIcon } from '@mui/x-date-pickers';
import { DashboardContext } from '../utils/AppUtil';

export default function SideNavBar() {
  const { collapseSidebar } = useProSidebar();
  const [open, setOpen] = useState(false);
  const [currentDate, setCurrrentDate] = useState('');
  const dashboardState = useContext(DashboardContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDashboardChanged = (dashboard) => {
     console.log('Dashboard: ', dashboard);
     setCurrrentDate(dashboard.year + " / " + dashboard.month);
  }

  useEffect(() => {
    console.log("[Sidebar][UseEffect] Initializing Component.");
    const dashboardDate = dashboardState.getCurrentDate();
    setCurrrentDate(dashboardDate.year + " / " + dashboardDate.month);
    dashboardState.addListener(handleDashboardChanged);
    
  }, [dashboardState]);

  return (
    <Sidebar
      style={{ border: 'none', paddingRight: '1em', minHeight: '100vh' }}
      backgroundColor={'#252B30'}
    >
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0) {
              return {
                color: disabled ? '#eee' : '#B0B0B0',
                backgroundColor: active ? '#fff' : undefined,
                '&:hover': {
                  backgroundColor: '#335B8C !important',
                  color: 'white !important',
                  borderRadius: '8px !important',
                  fontWeight: 'bold !important',
                },
              };
            }
          },
        }}
      >
        <MenuItem
          className="Menu-Item"
          style={{ textAlign: 'center' }}
          icon={<MenuOutlinedIcon />}
          onClick={() => {
            collapseSidebar();
          }}
        >
          <h2>Budgeta</h2>
        </MenuItem>
        <MenuItem icon={<DashboardIcon />}>Dashboard</MenuItem>
        <MenuItem icon={<SettingsIcon />}>Settings</MenuItem>
        <MenuItem icon={<CalendarIcon />} onClick={handleClickOpen}>{currentDate}</MenuItem>
      </Menu>
      <CalendarDialog open={open} setOpen={setOpen} />
    </Sidebar>
    
  );
}
