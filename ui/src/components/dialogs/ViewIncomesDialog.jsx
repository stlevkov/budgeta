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
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { IncomesContext } from "../../utils/AppUtil";

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
const IncomeEditable = styled(TextField)(({ theme }) => ({
  "& .MuiInput-root": {
    border: "none",
    overflow: "hidden",
    fontSize: "3.3rem ",
    align: "center",
    marginTop: "10px",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      border: "none",
    },
    "& .MuiInputBase-root": {
      height: "3.5rem",
    },
  },
}));

export default function ViewIncomeDialog() {
  const [open, setOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [value, setValue] = useState(0);
  const incomesState = useContext(IncomesContext);

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
    setIncomes(incomesState.getState());
  });

  const handleChangeIncome = (income, event) => {
    income.value = Number(event.target.value);
    incomesState.onChange(income);
  };

  const handleKeyDown = (income, event) => {
    if (event.key === "Enter") {
      income.value = Number(event.target.value);
      incomesState.updateIncome(income);
    }
  };

  const removeIncome = (income, event) => {
    console.log("[ViewIncomesDialog]: Will delete item with id: " + income.id);
    incomesState.removeIncome(income);
    setValue(value - 1); // TODO This is not good, as it is some work around it shall be fixed
  };

  const tabs = [];
  for (let i = 0; i < incomes.length; i++) {
    tabs.push(<Tab key={"a" + i} label={incomes[i].name} {...a11yProps(i)} />);
  }

  const tabPanels = [];
  for (let incomeIndex = 0; incomeIndex < incomes.length; incomeIndex++) {
    tabPanels.push(
      <TabPanel key={incomeIndex} value={value} index={incomeIndex}>
        <IconButton sx={{ float: "right" }} onClick={(event) => removeIncome(incomes[incomeIndex], event)} color="primary" aria-label="remove expense" size="small" align="right">
          <DeleteIcon fontSize="medium" />
        </IconButton>
        <Typography component={"div"} variant="h4" gutterBottom>
          {incomes[incomeIndex].description}
        </Typography>

        <Typography component={"div"} variant="h2" gutterBottom>
          <IncomeEditable variant="standard" onKeyDown={(event) => handleKeyDown(incomes[incomeIndex], event)} InputProps={{ disableUnderline: true }} value={incomes[incomeIndex].value} onChange={(event) => handleChangeIncome(incomes[incomeIndex], event)} />
        </Typography>
        <Typography component={"div"} variant="h5" gutterBottom>
          Last updated: {incomes[incomeIndex].updatedAt}
        </Typography>
      </TabPanel>
    );
  }

  return (
    <>
      <Tooltip title={"See Details"} placement="top">
        <IconButton onClick={handleClickOpen} sx={{ float: "right" }} color="primary" aria-label="See Details" size="small" align="right">
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ float: "left" }}>
          All Incomes Details
          <IconButton sx={{ float: "right" }} onClick={handleClose} color="primary" aria-label="remove expense" size="small" align="right">
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
