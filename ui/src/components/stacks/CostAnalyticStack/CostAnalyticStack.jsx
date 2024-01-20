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
import config from "../../../resources/config";
import CreateIncomeDialog from "../../dialogs/CreateIncomeDialog";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import { CostAnalyticContext, IncomesContext, ExpensesContext, BalanceAccountContext, UnexpectedContext } from "../../../utils/AppUtil";
import CreateBalanceTransactionDialog from "../../dialogs/CreateBalanceTransactionDialog";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "0px 6px 8px #45464a"
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
  console.log("[CostAnalyticsStack] Initializing component.");
  const costAnalyticState = useContext(CostAnalyticContext);
  const expensesState = useContext(ExpensesContext);
  const incomesState = useContext(IncomesContext);
  const unexpectedsState = useContext(UnexpectedContext);
  const balanceAccountState = useContext(BalanceAccountContext);

  const [costAnalytic, setCostAnalytic] = useState({});
  const [targetSaving, setTargetSaving] = useState(0);
  const [sumIncomes, setSumIncomes] = useState(0);
  const [sumAllExpenses, setSumAllExpenses] = useState(0);

  const handleCostAnalyticStateChange = (newState) => {
    console.log(`[CostAnalyticsStack] CostAnalytic state has changed: ${newState}, target saving: ${newState.targetSaving}`);
    setTargetSaving(newState.targetSaving);
    setCostAnalytic(newState);
  };

  const handleIncomesChange = () => {
    console.log("[CostAnalyticsStack] Incomes state has changed");
    setSumIncomes(incomesState.getSumIncomes());
  };

  const handleUnexpectedsChange = () => {
    console.log('[CostAnalyticsStack] Unexpected state changed');
    setSumAllExpenses(expensesState.getSumExpenses() + unexpectedsState.getSumUnexpecteds());
  };

  const handleExpensesChange = () => {
    console.log('[CostAnalyticsStack] Expenses state changed');
    setSumAllExpenses(expensesState.getSumExpenses() + unexpectedsState.getSumUnexpecteds());
  };

  useEffect(() => {
    costAnalyticState.addListener(handleCostAnalyticStateChange);
    incomesState.addListener(handleIncomesChange);
    unexpectedsState.addListener(handleUnexpectedsChange);
    expensesState.addListener(handleExpensesChange);
    
    return () => { // Cleanup function to remove the listener when the component unmounts
      costAnalyticState.removeListener(handleCostAnalyticStateChange);
      incomesState.removeListener(handleIncomesChange);
      unexpectedsState.removeListener(handleUnexpectedsChange);
      expensesState.removeListener(handleExpensesChange);
    };
  }, [costAnalyticState, incomesState, unexpectedsState, expensesState]);

  const handleKeyDown = (targetSaving, event) => { // edit target unexpected
    if (event.key === "Enter") {
      costAnalyticState.updateCostAnalytic(); // Value is already set with onChange, so we just save it to DB
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
              <Typography style={{ float: "left", fontWeight: "bold" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
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
            <Tooltip title={<Typography fontSize="1.3em">Expenses and Unexpecteds sum</Typography>} placement="top">
              <Typography style={{ float: "left", fontWeight: "bold" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                ALL EXPENSES
              </Typography>
            </Tooltip>
            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {sumAllExpenses}
            </Typography>
          </Item>
        </Grid>

        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">All unexpecteds at one place</Typography>} placement="top">
              <Typography style={{ float: "left", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  maxWidth: "100%", // Ensure the text doesn't overflow the box
                }}
                component="p" color="orange" fontSize="1.5em" variant="standard" align="left" >
                BALANCE ACCOUNT
              </Typography>
            </Tooltip>

            <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
            <Typography style={{ marginTop: "20px", width: "fit-content" }} variant="standard" component="p" color="#b0b0b0" fontSize="3.3em" align="left">
              {costAnalytic.balanceAccount}
            </Typography>

            <CreateBalanceTransactionDialog balanceAccount={balanceAccountState} />
          </Item>
        </Grid>


        <Grid xs={12} sm={6} md={4} lg={2.3}>
          <Item style={{ height: "120px" }}>
            <Tooltip title={<Typography fontSize="1.3em">Savings each month</Typography>} placement="top">
              <Typography style={{ float: "left", fontWeight: "bold" }} component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
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
              <Typography style={{ fontWeight: "bold" }} component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
                DAILY TARGET
              </Typography>
            </Tooltip>
            <Divider style={{ width: "100%", marginTop: "0px", marginBottom: "8px" }} />

            <Typography style={{ marginTop: "20px", width: "100%" }} component="p" color="#b0b0b0" fontSize="3.3em" align="center">
              {costAnalytic.dailyRecommended < 0 ? 'no funds' : costAnalytic.dailyRecommended}
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
