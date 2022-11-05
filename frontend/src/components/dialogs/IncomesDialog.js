import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useEffect } from "react";

const defaultIncomes = [
  {
    "id": "6351b7623300ae5d85e36359",
    "name": "John",
    "description": "Main Salary Income",
    "value": 0,
    "updatedAt": "2022-11-02T21:39:24.034+00:00"
  },
  {
    "id": "6362e39db7a2ed58209231f7",
    "name": "Kery",
    "description": "Main Salary",
    "value": 0,
    "updatedAt": "2022-11-02T21:39:41.762+00:00"
  }
];

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

export default function IncomeDialog({ myData }) {
  const [open, setOpen] = React.useState(false);
  const [incomes, setIncomes] = React.useState(defaultIncomes)

  useEffect(() => {
    setIncomes(myData)
  }, []);

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

  return (
    <div>
      <Link
        href="#"
        color="inherit"
        fontSize="inherit"
        onClick={handleClickOpen}
        variant="inherit"
        >
        See Details
      </Link>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>All Incomes Details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label={incomes[0].name} {...a11yProps(0)} />
                  <Tab label={incomes[1].name} {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <h4>{incomes[0].description}</h4>
                <h2>{incomes[0].value}</h2>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <h4>{incomes[1].description}</h4>
                <h2>{incomes[1].value}</h2>
              </TabPanel>
            </Box>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
}
