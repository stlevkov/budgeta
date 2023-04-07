import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Unstable_Grid2";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import CreateExpenseDialog from "../../dialogs/CreateExpenseDialog";
import { CostAnalyticContext, ExpensesContext } from "../../../utils/AppUtil";
import RestClient from "../../../api/RestClient";
import PropTypes from "prop-types";
import config from "../../../resources/config.json";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const ExpenseEditable = styled(TextField)(({ theme }) => ({
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

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-block", width: props.sx.w, textAlign: "center" }}>
      <CircularProgress size={"2.2em"} variant="determinate" {...props} />
      <Box sx={{ top: -5, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function ExpensesDirectionStack() {
  const [expenses, setExpenses] = useState([]);
  const [progress, setProgress] = useState(43); // TODO - Calculate & Update dynamically
  const costAnalyticState = useContext(CostAnalyticContext);
  const expensesState = useContext(ExpensesContext);
  const restClient = new RestClient(config.api.expensesEndpoint); // TODO move to state

  const handleCostAnalyticStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING Analytic in EXPENSES has changed:", newState);
  };

  const handleExpensesStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING Expenses in EXPENSES has changed:", newState);
    setExpenses(newState);
  };

  useEffect(() => {
    setExpenses(expensesState.getState());
    setProgress(progress);

    costAnalyticState.addListener(handleCostAnalyticStateChange);
    expensesState.addListener(handleExpensesStateChange);

    return () => {
      setProgress(0);
      setExpenses([]);
      costAnalyticState.removeListener(handleCostAnalyticStateChange);
      expensesState.removeListener(handleExpensesStateChange);
    };
  }, [costAnalyticState, expensesState]);

  const onExpenseChange = (expense, event) => {
    expense.value = event.target.value;

    expensesState.updateExpense(expense);

    let costAnalytic = costAnalyticState.getState();
    costAnalytic.dailyRecommended -= 10; // TODO remove/fix this when dynamic update of daily recommended is fixed
    costAnalyticState.setState(costAnalytic);
  };

  // Edit expense event
  const handleKeyDown = (expense, event) => {
    if (event.key === "Enter") {
      expense.value = event.target.value;
      restClient.genericEdit(expense);
    }
  };

  const removeExpense = (expense, event) => {
    console.log("[ExpensesStack]: Will delete item with id: " + expense.id);
    restClient.genericDelete(expense); // TODO move to state
    expensesState.removeExpense(expense);
    setExpenses(expensesState.getState());
  };

  /*
    Default breakpoints
    Each breakpoint (a key) matches with a fixed screen width (a value):
        xs, extra-small: 0px
        sm, small: 600px
        md, medium: 900px
        lg, large: 1200px
        xl, extra-large: 1536px
  */
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container disableEqualOverflow spacing={{ xs: 2, md: 2 }}>
        <Grid xs={6} sm={4} md={3} lg={2} xl={1.5}>
          <Item style={{ backgroundColor: "#00000000", height: "70px" }}>
            <Box width={"100%"} height={"12%"}>
              <Tooltip title="All Monthly Expenses as a % from the Incomes" placement="top">
                <Typography style={{ float: "left" }} component="p" align="left" color="#9ccc12" variant="standard">
                  EXPENSES
                </Typography>
              </Tooltip>
              <CreateExpenseDialog />
            </Box>
            <Box width={"100%"} height={"75%"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography component="h4" align="center" variant="standard" style={{ width: "49%", fontSize: "1rem", color: "#78909c" }}>
                {expensesState.getSumExpenses()}
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <CircularProgressWithLabel sx={{ w: "49%" }} align="right" value={progress} />
            </Box>
          </Item>
        </Grid>
        {expenses.map((expense) => {
          return (
            <Grid xs={6} sm={4} md={3} lg={2} xl={1.5} key={expense.name}>
              <Item style={{ height: "70px" }}>
                <Tooltip title={expense.description} placement="top">
                  <Typography style={{ float: "left" }} component="p" align="left" color="#9ccc12" variant="standard">
                    {expense.name}
                  </Typography>
                </Tooltip>

                <Tooltip title={"Remove " + expense.name} placement="top">
                  <IconButton sx={{ mt: -1, mr: -1, float: "right" }} onClick={(event) => removeExpense(expense, event)} color="primary" aria-label="remove expense" size="small" align="right">
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>

                <ExpenseEditable id={`${expense.name}-input`} variant="standard" InputProps={{ disableUnderline: true }} onKeyDown={(event) => handleKeyDown(expense, event)} onChange={(e) => onExpenseChange(expense, e)} defaultValue={expense.value} />
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
