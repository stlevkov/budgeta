import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import config from "../resources/config.json";
import data from "../resources/data.json";
import ResponsiveGrid from "./Test";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import ExpensesStack from "../components/stacks/ExpensesStack/ExpensesStack";
import SavingsStack from "../components/stacks/SavingsStack/SavingsStack";
import CostAnalyticStack from "../components/stacks/CostAnalyticStack/CostAnalyticStack";
import StatisticChart from "../components/stacks/MonitoringStack/StatisticChart";
import TargetSavingChart from "../components/stacks/MonitoringStack/TargetSavingChart";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";

const fetchData = async (setState, setSumState, defaultState, endpoint) => {
  try {
    const response = await axios.get(config.server.uri + endpoint);
    if (response.data !== "") {
      setState(response.data);
      if (setSumState) {
        setSumState(sumValues(response.data));
      }
    } else {
      console.log("Something is wrong");
      setState(defaultState);
      if (setSumState) {
        setSumState(sumValues(defaultState));
      }
    }
  } catch (err) {
    setState(defaultState);
    if (setSumState) {
      setSumState(sumValues(defaultState));
    }
  }
};

function sumValues(array) {
  let sum = 0;
  array.forEach((obj) => {
    sum += obj.value;
  });
  return sum;
}

function daysInThisMonth() {
  var now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export default function Dashboard() {
  const sidebarWidth = "12em";
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No error yet");
  const [open, setOpen] = useState(true);
  const [expenses, setExpenses] = useState([]); // TODO provide as hook in each Stack
  const [incomes, setIncomes] = useState([]); // TODO provide as hook in each Stack
  const [savings, setSavings] = useState([]); // TODO provide as hook in each Stack
  const [costAnalytics, setCostAnalytics] = useState({});

  const [sumExpenses, setSumExpenses] = useState(0);
  const [sumIncomes, setSumIncomes] = useState(0);
  const [sumSavings, setSumSavings] = useState(0);

  /**
   * Daily recommended: (Incomes - (Expenses + Savings + TargetSave + Unexpected)) / days in month
   * Monthly target:    (Incomes - (Expenses + Savings + TargetSave + Unexpected)
   *
   * @param {int} targetSaving Target Saving set by navbar field
   */
  const calculateCostAnalytics = (targetSaving) => {
    let sumAllExpenses = sumExpenses + sumSavings + parseFloat(targetSaving) + parseFloat(costAnalytics.unexpected);
    let daily = (sumIncomes - sumAllExpenses) / daysInThisMonth();
    let availableForSpend = sumIncomes - sumAllExpenses;
    const clone = structuredClone(costAnalytics);
    clone.dailyRecommended = Math.round((daily + Number.EPSILON) * 100) / 100;
    clone.monthlyTarget = Math.round((availableForSpend + Number.EPSILON) * 100) / 100;
    setCostAnalytics(clone);
  };

  useEffect(() => {
    fetchData(setExpenses, setSumExpenses, data.defaultExpenses, "expenses");
    fetchData(setIncomes, setSumIncomes, data.defaultIncomes, "incomes");
    fetchData(setSavings, setSumSavings, data.defaultSavings, "savings");
    fetchData(setCostAnalytics, false, data.defaultCostAnalytics, "costAnalytics");

    return () => {
      setExpenses([]);
      setIncomes([]);
      setSavings([]);
      setCostAnalytics({});
    };
  }, []);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: 6,
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <>
      {/* <ResponsiveGrid/> */} {/* Use this for reference if you broke the dashboard layout */}
      <ExpensesStack />
      <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
      <SavingsStack />
      <Divider>Analytics & Summary</Divider>
      <CostAnalyticStack costAnalyticState={costAnalytics} />
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "12px", marginBottom: "12px" }}>
        <Grid container rowSpacing={2} columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
          <Grid xs={2} sm={6} md={6}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={{ xs: 3, md: 3 }} columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
                {Array.from(Array(3)).map((_, index) => (
                  <Grid xs={2} sm={4} md={4} key={index}>
                    <Item style={{ height: "375px" }}>
                      <Tooltip title={<Typography fontSize="1.3em">Test Description</Typography>} placement="top">
                        <Typography component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
                          VACANCY
                        </Typography>
                      </Tooltip>
                      <br />
                      <Typography component="p" align="left" color="gray" fontSize="1.1em" variant="standard">
                        {"Estimated Date: 06/09/2023"}
                      </Typography>
                      <br />
                      <Box sx={{ flexGrow: 1 }}>
                        <TargetSavingChart />
                      </Box>
                      <br />
                      <Typography component="p" align="left" color="gray" fontSize="1.1em" variant="standard">
                        {"Earnings per day: 25"}
                      </Typography>
                    </Item>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          <Grid xs={2} sm={6} md={6}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid pl={3} container columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
                <Grid xs={2} sm={12} md={12}>
                  <Item style={{ height: "376px" }}>
                    <StatisticChart />
                  </Item>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer position="bottom-left" autoClose={6000} hideProgressBar newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}
