import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios, { AxiosError } from "axios";
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
import CreateExpenseDialog from "../../dialogs/CreateExpenseDialog";
import config from '../../../resources/config.json';
import data from '../../../resources/data.json';


function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex'}}>
      <CircularProgress variant="determinate" {...props} />
      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: 6,
  textAlign: 'center',
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
      const response = await axios.delete(config.server.uri + "expenses/" + expense.id);
      if (response.data !== "") {
        removeItemFromState();
      } else {
        console.log("Something is wrong");
      }
    } catch (err) {
      //console.log(err); TODO makes tests fail because of network delay response
      setExpenses(data.defaultExpenses);
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
        const response = await axios.get(config.server.uri + "expenses");
        if (response.data !== "") {
          setExpenses(response.data);
        } else {
          console.log("Something is wrong");
        }
      } catch (err) {
        //console.log(err); TODO makes tests fail because of network delay response
        setExpenses(data.defaultExpenses);
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
      axios.put(config.server.uri + "expenses/" + expense.id, expense, {
          headers: {
            "Content-Type": "application/json",
          },
        }).then((response) => {
          console.log("[ExpenseStack] RESPONSE OK: " + response.data);
        }).catch((error) => {
          console.log("[ExpenseStack] RESPONSE ERROR: " + error);
        });
    }
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
            <Item style={{ backgroundColor: '#00000000', height: "70px" }}>
          
                <Tooltip title="All Monthly Expenses as a % from the Incomes" placement="top">
                  <Typography style={{float: 'left'}} component="p" align="left" color="#9ccc12" variant="standard" >
                    REGULAR EXPENSES
                  </Typography>
                </Tooltip>
                <CreateExpenseDialog onCreate={addExpense} />
                <br/>
                <CircularProgressWithLabel sx={{ mt: 1 }} align="center" value={progress} />
            </Item>
          </Grid>
          {expenses.map((expense) => {
            return (
              <Grid xs={6} sm={4} md={3} lg={2} xl={1.5} key={expense.name}>
                <Item style={{ height: '70px' }}>
                    <Tooltip title={expense.description} placement="top">
                      <Typography style={{float: 'left'}} component="p" align="left" color="#9ccc12" variant="standard" >
                        {expense.name}
                      </Typography>
                    </Tooltip>

                    <Tooltip title={"Remove " + expense.name} placement="top">
                        <IconButton sx={{mt: -1, mr: -1, float: 'right'}} color="primary" aria-label="remove expense" size="small" align="right">
                          <CloseIcon fontSize="inherit" onClick={(event) => deleteExpense(expense, expenses, setExpenses, event)} />
                        </IconButton>
                    </Tooltip>

                    <ExpenseEditable id={`${expense.name}-input`} variant="standard"
                      InputProps={{
                        disableUnderline: true,
                      }}
                      onKeyDown={(event) => handleKeyDown(expense, event)} defaultValue={expense.value}/>
                </Item>
              </Grid>
            )
        })}
        </Grid>
      </Box>
    )
}

export default ExpensesDirectionStack;
