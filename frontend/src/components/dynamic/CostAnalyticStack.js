import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Link from '@mui/material/Link';

const defaultCostAnalytics = {
  "id": "635c504c360cfd5b7e0dd036",
  "targetSaving": 2555,
  "dailyRecommended": 37.26,
  "monthlyTarget": 3710.00,
  "allExpenses": 1790.00
};

const defaultIncomes = [
  {
    "id": "6351b7623300ae5d85e36359",
    "name": "John",
    "description": "Main Salary Income",
    "value": 4900,
    "updatedAt": "2022-11-02T21:39:24.034+00:00"
  },
  {
    "id": "6362e39db7a2ed58209231f7",
    "name": "Kery",
    "description": "Main Salary Income",
    "value": 1600,
    "updatedAt": "2022-11-02T21:39:41.762+00:00"
  }
];

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
    const response = await axios.get("http://localhost:8080/api/incomes");
    if (response.data !== "") {
      console.log(response.data); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("Something is wrong obtaining the incomes");
      return defaultIncomes;
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    return defaultIncomes;
  }
}

async function fetchCostAnalytics() {
  try {
    const response = await axios.get("http://localhost:8080/api/costAnalytics");
    if (response.data !== "") {
      console.log(response.data); //Prints out my three objects in an array in my console. works great
      return response.data;
    } else {
      console.log("Something is wrong getting the costAnalytics");
      return defaultCostAnalytics;
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    return defaultCostAnalytics;
  }
}

export default function CostAnalyticStack() {
  const [costAnalytic, setCostAnalytics] = useState({});
  const [incomes, setIncomes] = useState({});
  useEffect(() => {
    let fetchedCostAnalytics = fetchCostAnalytics();
    fetchedCostAnalytics.then((result) => {
      setCostAnalytics(result);
    });
    let fetchedIncomes = fetchIncomes();
    fetchedIncomes.then((result) => {
      setIncomes(result);
    });
  }, []);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 3, md: 3 }}
      justify="space-between"
    >
      {/* All Incomes */}
      <Item>
        <React.Fragment>
          <Tooltip title="All Collected Incomes" placement="top">
            <Typography
              component="p"
              color="orange"
              fontSize="1.5em"
              variant="standard"
              align="left"
            >
              INCOMES
            </Typography>
          </Tooltip>
          <Typography
            sx={{ mt: 2 }}
            component="p"
            color="#b0b0b0"
            fontSize="3em"
            align="left"
          >
            $ 4900
          </Typography>
          <Typography align="left">
          <Link href="#" color="inherit" variant="inherit">
            See Details
          </Link>
          </Typography>
        </React.Fragment>
      </Item>
      {/* Unexpected for month */}
      <Item>
        <React.Fragment>
          <Tooltip title="Unexpected spendings for the current month" placement="top">
            <Typography
              component="p"
              align="left"
              color="orange"
              fontSize="1.5em"
              variant="standard"
            >
              UNEXPECTED
            </Typography>
          </Tooltip>
          <Typography
            sx={{ mt: 3 }}
            component="p"
            color="#b0b0b0"
            fontSize="3em"
            align="left"
          >
            $ 2300
          </Typography>
        </React.Fragment>
      </Item>
      {/* All Expenses */}
      <Item>
        <React.Fragment>
          <Tooltip title="All Expenses without Savings" placement="top">
            <Typography
              component="p"
              align="left"
              color="orange"
              fontSize="1.5em"
              variant="standard"
            >
              ALL EXPENSES
            </Typography>
          </Tooltip>
          <Typography
            sx={{ mt: 3 }}
            component="p"
            color="#b0b0b0"
            fontSize="3em"
            align="left"
          >
            $ {costAnalytic.allExpenses}
          </Typography>
        </React.Fragment>
      </Item>
      {/* Monthly Target */}
      <Item>
        <React.Fragment>
          <Tooltip title="Monthly target for spendings" placement="top">
            <Typography
              component="p"
              align="left"
              color="orange"
              fontSize="1.5em"
              variant="standard"
            >
              MONTHLY TARGET
            </Typography>
          </Tooltip>
          <Typography
            sx={{ mt: 3 }}
            component="p"
            color="#b0b0b0"
            fontSize="3em"
            align="left"
          >
            $ {costAnalytic.monthlyTarget}
          </Typography>
        </React.Fragment>
      </Item>
      {/* Daily Recommended */}
      <Item>
        <React.Fragment>
          <Tooltip title="Daily recommended - try not to exceed" placement="top">
            <Typography
              component="p"
              align="left"
              color="orange"
              fontSize="1.5em"
              variant="standard"
            >
              DAILY RECOMMENDED
            </Typography>
          </Tooltip>
          <Typography
            sx={{ mt: 3 }}
            component="p"
            color="#b0b0b0"
            fontSize="3em"
            align="left"
          >
            $ {costAnalytic.dailyRecommended}
          </Typography>
        </React.Fragment>
      </Item>
    </Stack>
  );
}