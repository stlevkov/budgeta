import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

const defaultExpenses = [
  {name: "TV/GSM", description: "Test", value: "80"},
  {name: "PET", description: "My pet expenses for the month", value: "135"},
  {name: "APARTMENT", description: "Monthly fee (LOAN) for the apartment", value: "765"},
  {name: "WATER/ENERGY", description: "Water consumption and Energy", value: "258"},
  {name: "GARAGE RENT", description: "Garage fee for parking the car", value: "120"},
  {name: "COSMETICS", description: "Monthly expenses for cosmetics stuffs", value: "75"},
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  width: "10em",
  height: "6em",
  color: theme.palette.text.secondary,
}));

const ExpensesDirectionStack = () => {
  const [expenses, setExpenses] = useState([]);
  useEffect(() => {
    const fetchAllExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/expenses");
        if (response.data !== "") {
          console.log(response.data); //Prints out my three objects in an array in my console. works great
          let objects = response.data.map(JSON.stringify);
          let uniqueSet = new Set(objects);
          let uniqueArray = Array.from(uniqueSet).map(JSON.parse);
          setExpenses(uniqueArray);
        } else {
          console.log("Something is wrong")
        }
      } catch (err) {
        //console.log(err); TODO makes tests fail because of network delay response
        setExpenses(defaultExpenses);
      }
    };
    fetchAllExpenses();
    return () => {
      setExpenses([]);
    };
  }, []);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 1, sm: 2, md: 2 }}
    >
      {expenses.map((expense) => {
        return <Item>
          <React.Fragment>
            <Tooltip title={expense.description} placement="top">
              <Typography component="p" align="left" color="orange" variant="standard">
                {expense.name}
              </Typography>
            </Tooltip>
            <Typography sx={{ mt: 1 }} component="p" color="black" align="left" variant="h5">
              $ {expense.value}
            </Typography>
          </React.Fragment>
        </Item>;
      })}
    </Stack>
  );
};

export default ExpensesDirectionStack;