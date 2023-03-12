import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect } from "react";
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ViewIncomeDialog({ myData }) {
  const [open, setOpen] = React.useState(false);
  const [incomes, setIncomes] = React.useState([])

  useEffect(() => {
    setIncomes(myData)
  }, [myData]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const tabs = [];
  for (let i = 0; i < incomes.length; i++) {
      tabs.push(<Tab label={incomes[i].name} {...a11yProps(i)} />);
  }

  const tabPanels = [];
  for (let i = 0; i < incomes.length; i++) {
      tabPanels.push(
        <TabPanel key={i} value={value} index={i}>
            <Typography variant="h4" gutterBottom>{incomes[i].description}</Typography>
            <Typography variant="h2" gutterBottom>{incomes[i].value}</Typography>
            <Typography variant="h5" gutterBottom>Last updated: {incomes[i].updatedAt}</Typography>
        </TabPanel>
      );
  }

  return (
    <div>

      <Tooltip title={"See Details"} placement="top">
          <IconButton sx={{mt: -1, mr: -1, float: 'right'}} color="primary" aria-label="See Details" size="small" align="right">
            <InfoIcon fontSize="inherit" onClick={handleClickOpen} />
          </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>All Incomes Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                 {tabs}
                </Tabs>
              </Box>
                {tabPanels}
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
