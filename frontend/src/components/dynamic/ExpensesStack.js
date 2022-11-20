import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Grid from "@mui/material/Unstable_Grid2";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CreateExpenseDialog from "../../components/dialogs/CreateExpenseDialog";

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ mt: 1 }} variant="caption" component="div" color="text.secondary">
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

const defaultExpenses = [
  { name: "TV/GSM", description: "Test", value: "80" },
  { name: "PET", description: "My pet expenses for the month", value: "135" },
  {
    name: "APARTMENT",
    description: "Monthly fee (LOAN) for the apartment",
    value: "765",
  },
  {
    name: "WATER/ENERGY",
    description: "Water consumption and Energy",
    value: "258",
  },
  {
    name: "GARAGE RENT",
    description: "Garage fee for parking the car",
    value: "120",
  },
  {
    name: "COSMETICS",
    description: "Monthly expenses for cosmetics stuffs",
    value: "75",
  },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  width: "16em",
  height: "6em",
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

const deleteExpense = (expense, expenses, setExpenses, event) => {
  console.log("Will delete item with id: " + expense.id);

  const removeExpenseRequest = async () => {
    try {
      const response = await axios.delete("http://localhost:8080/api/expenses/" + expense.id);
      if (response.data !== "") {
        removeItemFromState();
      } else {
        console.log("Something is wrong");
      }
    } catch (err) {
      //console.log(err); TODO makes tests fail because of network delay response
      setExpenses(defaultExpenses);
    }
  };

  const removeItemFromState = () => {
    var array = [...expenses];
    var index = array.indexOf(expense)
    if (index !== -1) {
      array.splice(index, 1);
      setExpenses(array);
    }
  };
  removeExpenseRequest();
};

const ExpensesDirectionStack = (expensesState) => {
  const [expenses, setExpenses] = useState([]);
  const [progress, setProgress] = useState(43); // TODO - Calculate & Update dynamically 

  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/expenses");
        if (response.data !== "") {
          setExpenses(response.data);
        } else {
          console.log("Something is wrong");
        }
      } catch (err) {
        //console.log(err); TODO makes tests fail because of network delay response
        setExpenses(defaultExpenses);
      }
    };
    setProgress(progress);
    fetchAllExpenses();
    return () => {
      setProgress(0);
      setExpenses([]);
    };
  }, []);

  function addExpense(expense){
    console.log("Will add expense: " + expense);
    expenses.push(expense);
    var array = [...expenses];
    setExpenses(array);
  };

  // edit expense
  const handleKeyDown = (expense, event) => {
    if (event.key === "Enter") {
      expense.value = event.target.value;
      axios
        .put(`http://localhost:8080/api/expenses/${expense.id}`, expense, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(
            "[ExpenseStack] RESPONSE OK: " + JSON.stringify(response.data)
          );
        })
        .catch((error) => {
          console.log("[ExpenseStack] RESPONSE ERROR: " + error);
        });
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 2, md: 2 }}
    >
      {/* All Expenses */}
      <Item style={{ backgroundColor: '#00000000', width: 130, height: "auto" }}>
        <React.Fragment>
          <Grid container spacing={0}>
            <Grid xs={12} md={11}>
              <Tooltip title="All expenses as a % of the Incomes" placement="top">
                <Typography
                  component="p"
                  align="left"
                  color="#9ccc12"
                  variant="standard"
                >
                  EXPENSES
                </Typography>
              </Tooltip>
            </Grid>
            <Grid xs={12} md={1}>
              <CreateExpenseDialog onCreate={addExpense} />
            </Grid>
          </Grid>
          <CircularProgressWithLabel sx={{ mt: 1 }} value={progress} />
        </React.Fragment>
      </Item>

      {expenses.map((expense) => {
        return (
          <Grid container spacing={0}>
            <Item key={expense.name} style={{width: 200, height: "auto"}} sx={{ display: "flex", flexWrap: "wrap" }}>
              <Grid xs={12} md={11}>
                <Tooltip title={expense.description} placement="top">
                  <Typography
                    component="p"
                    align="left"
                    color="#9ccc12"
                    variant="standard"
                  >
                    {expense.name}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid xs={12} md={1}>
                <Tooltip title={"Remove " + expense.name} placement="top">
                  <IconButton
                    sx={{ mt: -1.5 }}
                    color="primary"
                    aria-label="remove expense"
                    size="small"
                    align="right"
                  >
                    <CloseIcon fontSize="inherit" onClick={(event) => deleteExpense(expense, expenses, setExpenses, event)} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid xs={1} md={2}>
                <Typography
                  sx={{ paddingRight: "1rem", fontSize: "2rem" }}
                  component="p"
                  align="center"
                >
                  $
                </Typography>
              </Grid>
              <Grid xs={11} md={10}>
                <ExpenseEditable
                  id={`${expense.name}-input`}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onKeyDown={(event) => handleKeyDown(expense, event)}
                  defaultValue={expense.value}
                />
              </Grid>
            </Item>
          </Grid>
        );
      })}
    </Stack>
  );
};

export default ExpensesDirectionStack;
