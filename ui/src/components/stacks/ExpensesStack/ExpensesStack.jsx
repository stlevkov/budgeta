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
import { ExpensesContext, IncomesContext } from "../../../utils/AppUtil";
import PropTypes from "prop-types";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "0px 6px 8px #45464a"
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
  const [progress, setProgress] = useState(0); // TODO - Calculate & Update dynamically
  const expensesState = useContext(ExpensesContext);
  const incomesState = useContext(IncomesContext);

  const descSort = (expenses) => {
    const sortedData = [...expenses];
    sortedData.sort((a, b) => b.value - a.value);
    return sortedData;
  }

  const handleExpensesStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING Expenses in EXPENSES has changed:", newState);
    setExpenses(descSort(newState));
    setProgress((expensesState.getSumExpenses() / incomesState.getSumIncomes()) * 100);
  };

  useEffect(() => {
    setExpenses(descSort(expensesState.getState()));
    setProgress((expensesState.getSumExpenses() / incomesState.getSumIncomes()) * 100);

    expensesState.addListener(handleExpensesStateChange);

    return () => {
      setProgress(0);
      setExpenses([]);
      expensesState.removeListener(handleExpensesStateChange);
    };
  }, [expensesState]);

  const onExpenseChange = (expense, event) => {
    expense.value = Number(event.target.value);
    expensesState.onChange(expense);
  };

  // Edit expense event
  const handleKeyDown = (expense, event) => {
    if (event.key === "Enter") {
      expense.value = Number(event.target.value);
      expensesState.updateExpense(expense);
    }
  };

  const removeExpense = (expense, event) => {
    console.log("[ExpensesStack]: Will delete item with id: " + expense.id);
    expensesState.removeExpense(expense);
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
          <Item style={{ backgroundColor: "#321f36", height: "70px" }}>
            <Box width={"100%"} height={"12%"}>
              <Tooltip title="All Monthly Expenses as a % from the Incomes" placement="top">
                <Typography style={{ float: "left", fontWeight: "bold" }} component="p" align="left" color="#9ccc12" variant="standard">
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
              <CircularProgressWithLabel sx={{ w: "50%" }} align="right" value={progress} />
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
