import * as React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ViewIncomeDialog from "../../dialogs/ViewIncomesDialog";
import Grid from "@mui/material/Unstable_Grid2";
import config from "../../../resources/config.json";
import data from "../../../resources/data.json";
import CreateIncomeDialog from "../../dialogs/CreateIncomeDialog";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { toast } from "material-react-toastify";
import { CostAnalyticContext } from "../../../utils/AppUtil";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const AnalyticsTextField = styled(Typography)(({ theme }) => ({
  "& .MuiInput-root": {
    border: "none",
    overflow: "hidden",
    fontSize: "2rem ",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      border: "none",
    },
  },
}));

async function fetchIncomes() {
  try {
    const response = await axios.get(config.server.uri + "incomes");
    if (response.data !== "") {
      console.log("[CostAnalytics][Incomes] response data", response.data); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("[CostAnalytics][Incomes] Something is wrong obtaining the incomes");
      return data.defaultIncomes;
    }
  } catch (err) {
    // console.log(err); // TODO makes tests fail because of network delay response
    return data.defaultIncomes;
  }
}

// TODO pass the value from parent instead of fetching it
async function fetchCostAnalytics() {
  try {
    console.log("[CostAnalytics] Fetching costAnalytics...");
    const response = await axios.get(config.server.uri + "costAnalytics");
    if (response.data !== "") {
      console.log("[CostAnalytics] Response: OK"); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("[CostAnalytics] Response: Error");
      return "error";
    }
  } catch (err) {
    console.log("[CostAnalytics] " + err);
    return "error";
  }
}

const TargetSavingEditable = styled(TextField)(({ theme }) => ({
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

/**
 * CostAnalyticState is provided by the parent. In this component, the daily recommended
 * is changed by the targetSaving upon change in realtime.
 *
 * @param {costAnalyticState analyticState is provided by the Parent! No local state.}
 * @param {recalculateCostAnalytic function to recalculate the costAnalytic}
 * @returns
 */
export default function CostAnalyticStack() {
  console.log("[CostAnalytics] Initializing component.");
  const costAnalyticState = useContext(CostAnalyticContext);
  const [costAnalytic, setCostAnalytic] = useState({});
  const [targetSaving, setTargetSaving] = useState(0);
  const [incomes, setIncomes] = useState([]);
  const [sumIncomes, setSumIncomes] = useState(0);

  const handleCostAnalyticStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING CostAnalytic in CostAnalyticSTACK has changed:", newState);
    setTargetSaving(newState.targetSaving);
    setCostAnalytic(newState);
  };

  useEffect(() => {
    let fetchedIncomes = fetchIncomes();
    fetchedIncomes.then((result) => {
      setIncomes(result);
      calculateSumIncomes(result);
    });

    // Add a listener to the costAnalyticState to track changes
    costAnalyticState.addListener(handleCostAnalyticStateChange);
    console.log("--------------------------- DASHBOARD USE EFFECT -------------");
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      costAnalyticState.removeListener(handleCostAnalyticStateChange);
    };
  }, [costAnalyticState]);

  function addIncome(income) {
    incomes.push(income);
    var array = [...incomes];
    setIncomes(array);
    calculateSumIncomes(array);
  }

  function calculateSumIncomes(incomes) {
    if (incomes.length > 1) {
      let sum = 0;
      incomes.forEach((income) => (sum += parseInt(income.value, 10)));
      setSumIncomes(sum);
    } else if (incomes.length === 1) {
      setSumIncomes(incomes[0].value);
    }
  }

  // edit target saving
  const handleKeyDown = (targetSaving, event) => {
    if (event.key === "Enter") {
      console.log("[AnalyticStack] Going to edit Target Saving. Value candidate: " + event.target.value);
      axios
        .put(config.server.uri + "costAnalytics/targetSaving", event.target.value, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("[AnalyticStack] RESPONSE OK: " + response.data);
          setTargetSaving(event.target.value);
          toast.success("Target Saving saved successfully!");
        })
        .catch((error) => {
          console.log("[AnalyticStack] RESPONSE ERROR: " + error);
          toast.error("Unable to save Target Saving. Try again, or check your internet connection!");
        });
    }
  };

  const onTargetSavingChange = (e) => {
    setTargetSaving(e.target.value);
    costAnalytic.targetSaving = e.target.value;
    costAnalytic.dailyRecommended += 5;
    costAnalyticState.setState(costAnalytic);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container disableEqualOverflow spacing={{ xs: 2, md: 2 }} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">All Collected Incomes each month</Typography>} placement="top">
              <Typography style={{ float: "left" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                INCOMES
              </Typography>
            </Tooltip>

            <ViewIncomeDialog myData={incomes} calculateSumIncomes={calculateSumIncomes} />
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} variant="standard" component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {sumIncomes}
            </Typography>

            <CreateIncomeDialog onCreate={addIncome} />
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">All expenses each month</Typography>} placement="top">
              <Typography style={{ float: "left" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                ALL EXPENSES
              </Typography>
            </Tooltip>
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {costAnalytic.allExpenses}
            </Typography>
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">All savings at one place</Typography>} placement="top">
              <Typography style={{ float: "left" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                SAVE BALLANCE
              </Typography>
            </Tooltip>

            {/* <ViewIncomeDialog myData={incomes} /> */}
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} variant="standard" component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {sumIncomes}
            </Typography>

            <CreateIncomeDialog onCreate={addIncome} />
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">Savings each month</Typography>} placement="top">
              <Typography style={{ float: "left" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                TARGET SAVING
              </Typography>
            </Tooltip>
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <TargetSavingEditable
              variant="standard"
              onKeyDown={(event) => handleKeyDown(targetSaving, event)}
              InputProps={{ disableUnderline: true }}
              value={targetSaving}
              onChange={(e) => {
                setTargetSaving(e.target.value);
              }}
            />
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.8}>
          <Item style={{ height: "120px", backgroundColor: "#07233e" }}>
            <Tooltip title={<Typography fontSize="1.3em">Daily recommended - try not to exceed</Typography>} placement="top">
              <Typography component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
                DAILY TARGET
              </Typography>
            </Tooltip>
            <Divider style={{ width: "100%", marginTop: "0px", marginBottom: "8px" }} />

            <Typography style={{ marginTop: "20px", width: "100%" }} component="p" color="#b0b0b0" fontSize="3.3em" align="center">
              {costAnalytic.dailyRecommended}
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
