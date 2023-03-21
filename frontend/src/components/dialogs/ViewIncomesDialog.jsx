import { useEffect, useState } from "react";
import axios from "axios";
import config from "../../resources/config.json";
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
import { toast } from "material-react-toastify";

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

export default function ViewIncomeDialog({ myData, calculateSumIncomes }) {
  const [open, setOpen] = useState(false);
  const [incomes, setIncomes] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    setIncomes(myData);
  }, [myData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // edit target saving
  const handleKeyDown = (income, event) => {
    if (event.key === "Enter") {
      console.log("[ViewIncomesDialog]: Going to edit Income. Value candidate: ", event.target.value);

      axios
        .put(`${config.server.uri}incomes/${income.id}`, income, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("[ViewIncomesDialog]: RESPONSE OK: ", response.data);

          toast.success("Income saved successfully!");
        })
        .catch((error) => {
          console.log("[ViewIncomesDialog]: RESPONSE ERROR: " + error);
          toast.error("Unable to save Income. Try again, or check your internet connection!");
        });
    }
  };
  const handleChangeIncome = (incomes, income, setIncomes, event) => {
    const updatedIncomes = incomes.map((_income, i) => {
      if (_income.id === income.id) {
        _income.value = event.target.value;
      }
      return _income;
    });

    setIncomes(updatedIncomes);
    calculateSumIncomes(updatedIncomes);
  };

  const deleteIncome = (incomes, income, setIncomes, event) => {
    console.log("[ViewIncomesDialog]: Will delete item with id: " + income.id);

    const removeIncomeRequest = async () => {
      try {
        const response = await axios.delete(config.server.uri + "incomes/" + income.id);
        if (response.data !== "") {
          removeItemFromState();
          toast.success("Income removed!");
        } else {
          console.log("[ViewIncomesDialog]: response data on remove income is empty");
          toast.error("Removing of this income failed!");
        }
      } catch (err) {
        //console.log(err); TODO makes tests fail because of network delay response
        console.log("[ViewIncomesDialog]: removeIncome failed with err: ", err.message);
        toast.error("Removing of this expense failed!");
      }
    };

    const removeItemFromState = () => {
      var array = [...incomes];
      var index = array.indexOf(income);
      if (index !== -1) {
        array.splice(index, 1);

        setIncomes(array);
        calculateSumIncomes(array);
      }
    };
    removeIncomeRequest();
  };

  const tabs = [];
  for (let i = 0; i < incomes.length; i++) {
    tabs.push(<Tab key={"a" + i} label={incomes[i].name} {...a11yProps(i)} />);
  }

  const tabPanels = [];
  for (let incomeIndex = 0; incomeIndex < incomes.length; incomeIndex++) {
    tabPanels.push(
      <TabPanel key={incomeIndex} value={value} index={incomeIndex}>
        <IconButton sx={{ float: "right" }} onClick={(event) => deleteIncome(incomes, incomes[incomeIndex], setIncomes, event)} color="primary" aria-label="remove expense" size="small" align="right">
          <DeleteIcon fontSize="medium" />
        </IconButton>
        <Typography component={"div"} variant="h4" gutterBottom>
          {incomes[incomeIndex].description}
        </Typography>

        <Typography component={"div"} variant="h2" gutterBottom>
          <IncomeEditable variant="standard" onKeyDown={(event) => handleKeyDown(incomes[incomeIndex], event)} InputProps={{ disableUnderline: true }} value={incomes[incomeIndex].value} onChange={(event) => handleChangeIncome(incomes, incomes[incomeIndex], setIncomes, event)} />
        </Typography>
        <Typography component={"div"} variant="h5" gutterBottom>
          Last updated: {incomes[incomeIndex].updatedAt}
        </Typography>
      </TabPanel>
    );
  }

  return (
    <div>
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
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                {tabs}
              </Tabs>
            </Box>
            {tabPanels}
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
