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
import { CostAnalyticContext, IncomesContext, ExpensesContext } from "../../../utils/AppUtil";
import CreateBalanceTransactionDialog from "../../dialogs/CreateBalanceTransactionDialog";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
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

export default function CostAnalyticStack() {
  console.log("[CostAnalytics] Initializing component.");
  const costAnalyticState = useContext(CostAnalyticContext);
  const expensesState = useContext(ExpensesContext); // TODO shall become property of CostAnalytic, move it
  const incomesState = useContext(IncomesContext); // TODO shall become property of CostAnalytic, move it

  const [costAnalytic, setCostAnalytic] = useState({});
  const [targetSaving, setTargetSaving] = useState(0);
  const [sumIncomes, setSumIncomes] = useState(0);

  const handleCostAnalyticStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING CostAnalytic in CostAnalyticSTACK has changed:", newState);

    setTargetSaving(newState.targetSaving);
    setCostAnalytic(newState);
  };

  const handleIncomesChange = () => { // TODO move this, as it shall become property of the CostAnalytic
    console.log("DO SOMETHING Income in Incomes has changed:");
    setSumIncomes(incomesState.getSumIncomes());
  };

  useEffect(() => {
    setSumIncomes(incomesState.getSumIncomes());
    // Add a listener to the costAnalyticState to track changes
    costAnalyticState.addListener(handleCostAnalyticStateChange);
    incomesState.addListener(handleIncomesChange);
    // Cleanup function to remove the listener when the component unmounts
    return () => {
      costAnalyticState.removeListener(handleCostAnalyticStateChange);
      incomesState.removeListener(handleIncomesChange);
    };
  }, [costAnalyticState, incomesState, sumIncomes]);

  // edit target unexpected
  const handleKeyDown = (targetSaving, event) => {
    if (event.key === "Enter") {
      // Value is already set with onChange, so we just save it to DB
      costAnalyticState.updateCostAnalytic();
    }
  };

  const onTargetSavingChange = (e) => {
    costAnalyticState.onChangeTargetSaving(Number(e.target.value));
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

            <ViewIncomeDialog />
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} variant="standard" component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {sumIncomes}
            </Typography>

            <CreateIncomeDialog />
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
              {expensesState.getSumExpenses()}
            </Typography>
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">All unexpecteds at one place</Typography>} placement="top">
              <Typography style={{ float: "left" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                BALANCE ACCOUNT
              </Typography>
            </Tooltip>

            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} variant="standard" component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {costAnalytic.balanceAccount}
            </Typography>

            <CreateBalanceTransactionDialog costAnalytic={costAnalyticState} />
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
            <TargetSavingEditable variant="standard" InputProps={{ disableUnderline: true }}
              onKeyDown={(event) => handleKeyDown(targetSaving, event)}
              value={targetSaving}
              onChange={(e) => {
                onTargetSavingChange(e);
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
