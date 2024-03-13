import { useEffect, useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import CreateBalanceTransactionDialog from "./CreateBalanceTransactionDialog";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" key={index} hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ViewBalanceAccountDialog({balanceAccountState}) {
  const [open, setOpen] = useState(false);
  const [balanceAccounts, setBalanceAccounts] = useState([]);
  const [value, setValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setBalanceAccounts(balanceAccountState.getState());
  });

  const removeBalanceAccount = (balanceAccount, event) => {
    console.log("[ViewBalanceAccountDialog]: Will delete item with id: " + balanceAccount.id);
    balanceAccountState.removeBalanceAccount(balanceAccount);
    setValue(value - 1); // TODO This is not good, as it is some work around it shall be fixed
  };

  const tabs = [];
  for (let i = 0; i < balanceAccounts.length; i++) {
    tabs.push(<Tab key={"a" + i} label={balanceAccounts[i].name} {...a11yProps(i)} />);
  }

  const tabPanels = [];
  for (let balanceAccountIndex = 0; balanceAccountIndex < balanceAccounts.length; balanceAccountIndex++) {
    tabPanels.push(
      <TabPanel key={balanceAccountIndex} value={value} index={balanceAccountIndex}>
        <div style={{ position: 'relative' }}>
        <IconButton sx={{float: "right"}} onClick={(event) => removeBalanceAccount(balanceAccounts[balanceAccountIndex], event)} color="primary" aria-label="remove balance account" size="small">
              <DeleteIcon fontSize="medium" />
            </IconButton>
          <Typography component={"div"} variant="h5" gutterBottom>
            {balanceAccounts[balanceAccountIndex].description}
          </Typography>
  
          <Typography component={"div"} variant="h2" gutterBottom>
             {balanceAccounts[balanceAccountIndex].value}
          </Typography>

          <Typography color={"green"} component={"div"} variant="h5" gutterBottom>
             {balanceAccounts[balanceAccountIndex].primary ? "Primary" : ""}
          </Typography>

          <Typography color={"lightblue"} component={"div"} variant="h5" gutterBottom>
             {balanceAccounts[balanceAccountIndex].active ? "Active" : ""}
          </Typography>

          <Typography component={"div"} variant="h5" gutterBottom>
            Last updated: {dayjs(balanceAccounts[balanceAccountIndex].updatedAt).format("MMMM YYYY | hh:mm")}
          </Typography>
  
          <div style={{ position: 'absolute', bottom: -46, right: -45, display: 'flex', alignItems: 'center' }}>
            <CreateBalanceTransactionDialog balanceAccountState={balanceAccountState} balanceAccount={balanceAccounts[balanceAccountIndex]} />
          </div>
        </div>
      </TabPanel>
    );
  }
  
  

  return (
    <>
      <Tooltip title={"See Details"} placement="top">
        <IconButton onClick={handleClickOpen} sx={{ float: "right" }} color="primary" aria-label="See Saving Places Details" size="small" align="right">
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ float: "left" }}>
          All Savings Details
          <IconButton sx={{ float: "right" }} onClick={handleClose} color="primary" aria-label="remove balance account" size="small" align="right">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
                {tabs}
              </Tabs>
            </Box>
            {tabPanels}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
