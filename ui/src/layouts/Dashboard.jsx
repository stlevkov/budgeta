import * as React from "react";
import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import ExpensesStack from "../components/stacks/ExpensesStack/ExpensesStack";
import SavingsStack from "../components/stacks/UnexpectedsStack/UnexpectedsStack";
import CostAnalyticStack from "../components/stacks/CostAnalyticStack/CostAnalyticStack";
import StatisticChart from "../components/stacks/MonitoringStack/StatisticChart";
import TargetSavingChart from "../components/stacks/MonitoringStack/TargetSavingChart";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import UsagesPieChart from "../components/stacks/MonitoringStack/UsagesPieChart";
import { DashboardContext, ExpensesContext } from "../utils/AppUtil";
import { CircularProgress, Skeleton } from "@mui/material";

export default function Dashboard() {
  const sidebarWidth = "12em";
  const dashboardState = useContext(DashboardContext);
  const expensesState = useContext(ExpensesContext);
  const [loading, setLoading] = useState(true);
  const [loadingVacancy, setLoadingVacancy] = useState(true);
  const [errorMessageOpen, setErrorMessageOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("No error yet");
  const [open, setOpen] = useState(true);

  const handleDashboardStateChanged = (state) => {
    setLoading(false);
  };

  const handleExpensesStateChanged = (state) => {
    setLoadingVacancy(false);
  };

  useEffect(() => {
    console.log("[Dashboard][UseEffect] Initializing Component.");
    dashboardState.addListener(handleDashboardStateChanged);
    expensesState.addListener(handleExpensesStateChanged);
    handleExpensesStateChanged("ignore");
  }, [dashboardState, expensesState]);

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: 6,
    textAlign: "center",
    color: theme.palette.text.secondary,
    boxShadow: "0px 6px 8px #45464a"
  }));

  return (
    <>
      <ExpensesStack />
      <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
      <SavingsStack />
      <Divider style={{ width: "100%", marginTop: "8px", marginBottom: "8px" }} />
      <CostAnalyticStack />
      <Box sx={{ flexGrow: 1 }} style={{ marginTop: "12px", marginBottom: "12px" }}>
        <Grid container rowSpacing={2} columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
          <Grid xs={2} sm={6} md={6}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
                <Grid xs={2} sm={4} md={4}>
                  {(loadingVacancy ?
                    <Skeleton sx={{ bgcolor: 'grey.500' }} variant="rounded" height={385} />
                    :
                    <Item style={{ height: "375px" }}>
                      <Tooltip title={<Typography fontSize="1.3em">Test Description</Typography>} placement="top">
                        <Typography style={{ fontWeight: "bold" }} component="p" align="left" color="orange" fontSize="1.5em" variant="standard">
                          VACANCY
                        </Typography>
                      </Tooltip>
                      <br />
                      <Typography component="p" align="left" color="gray" fontSize="1.1em" variant="standard">
                        {"Estimated Date: 06/09/2023"}
                      </Typography>
                      <br />
                      <TargetSavingChart id={1} />
                      <br />
                      <Typography component="p" align="left" color="gray" fontSize="1.1em" variant="standard">
                        {"Earnings per day: 25"}
                      </Typography>
                    </Item>
                  )}
                </Grid>

                <Grid xs={2} sm={8} md={8}>
                  <UsagesPieChart />
                </Grid>
              </Grid>

            </Box>
          </Grid>

          <Grid xs={2} sm={6} md={6}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid pl={3} container columns={{ xs: 2, sm: 4, md: 12, lg: 12, xl: 12 }}>
                <Grid xs={2} sm={12} md={12}>
                  <StatisticChart />
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
