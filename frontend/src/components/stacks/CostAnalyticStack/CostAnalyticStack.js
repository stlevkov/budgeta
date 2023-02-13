import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import ViewIncomeDialog from "../../dialogs/ViewIncomesDialog";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Unstable_Grid2";
import InputUnexpected from "./Unexpected";
import config from "../../../resources/config.json";
import data from "../../../resources/data.json";
import CreateIncomeDialog from "../../dialogs/CreateIncomeDialog";
import WithdrawSavingsDialog from "../../dialogs/WithdrawSavingsDialog";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  width: "20em",
  height: "10em",
  color: theme.palette.text.secondary,
}));

async function fetchIncomes() {
  try {
    const response = await axios.get(config.server.uri + "incomes");
    if (response.data !== "") {
      console.log(response.data); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("Something is wrong obtaining the incomes");
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
    const response = await axios.get(config.server.uri + "costAnalytics");
    if (response.data !== "") {
      console.log(response.data); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("Something is wrong getting the costAnalytics");
      return data.defaultCostAnalytics;
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    return data.defaultCostAnalytics;
  }
}

export default function CostAnalyticStack({ costAnalyticState }) {
  const [costAnalytic, setCostAnalytics] = useState(data.defaultCostAnalytics);
  const [incomes, setIncomes] = useState([]);
  const [sumIncomes, setSumIncomes] = useState(0);

  useEffect(() => {
    let fetchedCostAnalytics = fetchCostAnalytics();
    fetchedCostAnalytics.then((resultCostAnalytic) => {
      setCostAnalytics(resultCostAnalytic);
    });
    let fetchedIncomes = fetchIncomes();
    fetchedIncomes.then((result) => {
      setIncomes(result);
      calculateSumIncomes(result);
    });
  }, []);

  function addIncome(income) {
    incomes.push(income);
    var array = [...incomes];
    setIncomes(array);
    calculateSumIncomes(array);
  }

  function calculateSumIncomes(incomes) {
    if (incomes.length > 1) {
      let sum = 0;
      incomes.forEach((income) => (sum += income.value));
      setSumIncomes(sum);
    } else if (incomes.length === 1) {
      setSumIncomes(incomes[0].value);
    }
  }

  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 2, sm: 3, md: 3 }} justify="space-between">
      {/* All Incomes */}

      <Item>
        <React.Fragment>
          <Grid container spacing={0}>
            <Grid xs={6} md={11}>
              <Tooltip title={<Typography fontSize="1.3em">All Collected Incomes each month</Typography>} placement="top">
                <Typography component="p" color="orange" fontSize="1.5em" variant="standard" align="left">
                  INCOMES
                </Typography>
              </Tooltip>
            </Grid>
            <Grid xs={6} md={12}>
              <Typography sx={{ mt: 1 }} component="p" color="#b0b0b0" fontSize="3em" align="left">
                ${sumIncomes}
              </Typography>
            </Grid>
            <Grid xs={6} md={10}>
              <Typography sx={{ mt: 0 }} fontSize="1.3em" align="left">
                <ViewIncomeDialog myData={incomes} />
              </Typography>
            </Grid>
            <Grid xs={6} md={2}>
              <IconButton sx={{ mt: -1.5 }} color="primary" aria-label="add another income" size="large" align="right">
                <CreateIncomeDialog onCreate={addIncome} />
              </IconButton>
            </Grid>
          </Grid>
        </React.Fragment>
      </Item>
      {/* Unexpected for month */}
      <Item>
        <React.Fragment>
          <InputUnexpected myData={costAnalytic.unexpected} />
        </React.Fragment>
      </Item>
      {/* Monthly Target */}
      <Item>
        <React.Fragment>
          <Tooltip title={<Typography fontSize="1.3em">Monthly money left for spendings - try not to exceed</Typography>} placement="top">
            <Typography component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
              MONTHLY TARGET
            </Typography>
          </Tooltip>

          <Typography sx={{ mt: 1 }} component="p" color="#b0b0b0" fontSize="3em" align="left">
            $ {costAnalyticState.monthlyTarget}
          </Typography>
        </React.Fragment>
      </Item>
      {/* Monthly Target */}
      <Item>
        <React.Fragment>
          <Tooltip title={<Typography fontSize="1.3em">All the money from target saving each month</Typography>} placement="top">
            <Typography component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
              SAVINGS ACCOUNT
            </Typography>
          </Tooltip>
          <Typography sx={{ mt: 1 }} component="p" color="#b0b0b0" fontSize="3em" align="left">
            $ {costAnalytic.savingAccountBalance}
          </Typography>
          <Grid container spacing={0}>
            <Grid xs={8} md={10}>
              <Typography sx={{ mt: 0 }} fontSize="1.3em" align="left">
                <ViewIncomeDialog myData={incomes} />
              </Typography>
            </Grid>
            <Grid xs={4} md={2}>
              <IconButton sx={{ mt: -1.5 }} color="primary" aria-label="add another income" size="large" align="right">
                <WithdrawSavingsDialog onCreate={addIncome} currentBallance={costAnalytic.savingAccountBalance} />
              </IconButton>
            </Grid>
          </Grid>
        </React.Fragment>
      </Item>
      {/* Daily Recommended */}
      <Item style={{ backgroundColor: "#07233e" }}>
        <React.Fragment>
          <Tooltip title={<Typography fontSize="1.3em">Daily recommended - try not to exceed</Typography>} placement="top">
            <Typography component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
              DAILY RECOMMENDED
            </Typography>
          </Tooltip>
          <Typography sx={{ mt: 1 }} component="p" color="#b0b0b0" fontSize="3em" align="left">
            $ {costAnalyticState.dailyRecommended}
          </Typography>
        </React.Fragment>
      </Item>
    </Stack>
  );
}
