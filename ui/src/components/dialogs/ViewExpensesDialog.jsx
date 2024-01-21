import { useEffect, useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ExpensesContext } from "../../utils/AppUtil";
import { Button, Checkbox, Divider, FormControlLabel, Grid, Switch } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";

/**
 * This dialog is intended to provide Loan information as well as grouping information
 * 
 * @returns 
 */
export default function ViewExpenseDialog({ expense }) {
  const expensesState = useContext(ExpensesContext);
  const [open, setOpen] = useState(false);
  const [loanToggle, setLoanToggle] = useState(false);
  const [scheduleToggle, setScheduleToggle] = useState(false);
  const [hoverColor, setHoverColor] = useState('#9ccc12');
  const [localExpense, setLocalExpense] = useState(expense);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const clearExpense = { ...expense }; // store initial state

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setLocalExpense(clearExpense);
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log('Will save Expense: ', localExpense);
    expensesState.updateExpense(localExpense);
    setOpen(false);
  }

  const onExpenseChange = (prop, value) =>{
    console.log('Changing: ', prop, value)
    localExpense[prop] = value;
    if(prop === 'loan') {setLoanToggle(value);}
    if(prop === 'scheduled') {setScheduleToggle(value);}
    console.log('Local expense: ', localExpense)
  }

  const removeExpense = (expense, event) => {
    console.log("[ViewExpensesDialog]: Will delete item with id: " + expense.id);
    expensesState.removeExpense(expense);
  };

  const handleExpensesStateChange = (newState) => {
    expense = newState;
  }

  const ScheduleComponent = () => {

    const monthIntegers = [...Array(13).keys()]; // [0, 1, 2, ..., 11]

    const handleMonthChange = (month) => {
      const updatedMonths = selectedMonths.includes(month)
        ? selectedMonths.filter(selectedMonth => selectedMonth !== month)
        : [...selectedMonths, month];
  
      console.log('Selected months: ', updatedMonths);
  
      // Use monthIntegers to set integer representations in localExpense.scheduledPeriod
      localExpense.scheduledPeriod = updatedMonths.map(month => monthIntegers[months.indexOf(month) +1]);
  
      setSelectedMonths(updatedMonths);
    };
  
    return (
      <div sx={{ width: '100%' }}>
        {months.map((month, index) => (
          <FormControlLabel
            sx={{ width: 50 }}
            key={index}
            control={<Checkbox />}
            label={month}
            checked={selectedMonths.includes(month)}
            
            labelPlacement="bottom"
            onChange={() => handleMonthChange(month)}
          />
        ))}
      </div>
    );
  };

  function initializeSelectedMonths() {
    let arr = [];
    expense.scheduledPeriod.map(monthNumber => {   // [ 1, 5, 11]
      arr.push(months[monthNumber -1]);
    });
    setSelectedMonths(arr);
  }

  useEffect(() => {
    setLoanToggle(expense.loan);
    setScheduleToggle(expense.scheduled);
    expensesState.addListener(handleExpensesStateChange);
    if(expense.scheduled) {initializeSelectedMonths()}
    return () => {
      expensesState.removeListener(handleExpensesStateChange);
    };
  }, [expense]);

  return (
    <>
      <Tooltip title={expense.description} placement="top">
        <Typography style={{ float: "left", cursor: 'pointer', color: hoverColor }} component="p" align="left" color="#9ccc12"
          variant="standard" onClick={handleClickOpen} onMouseOver={() => setHoverColor('white')}
          onMouseOut={() => setHoverColor('#9ccc12')}>
          {localExpense.name}
        </Typography>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ float: "left" }}>
          Expense Details
          <IconButton sx={{ float: "right" }} onClick={handleClose} color="primary" aria-label="remove expense" size="small" align="right">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Tooltip title={"Remove " + localExpense.name} placement="top">
            <IconButton sx={{ mt: -1, mr: -1, float: "right" }} onClick={(event) => removeExpense(expense, event)} color="primary" aria-label="remove expense" size="small" align="right">
              <DeleteIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>

          <TextField sx={{ mb: 2 }}
            label="Edit Name"
            defaultValue={localExpense.name}
            onChange={(e) => onExpenseChange('name', e.target.value)}
            fullWidth
          />
          <TextField sx={{ mb: 2 }}
            label="Edit Description"
            defaultValue={localExpense.description}
            onChange={(e) => onExpenseChange('description', e.target.value)}
            fullWidth
          />
          <Grid container spacing={6}>
            {/* Left side */}
            <Grid item xs={12} sm={6}>
              <Typography>Enable Loan type</Typography>
              <Switch color="primary"
                defaultValue={localExpense.loan}
                defaultChecked={localExpense.loan}
                onChange={(e) => onExpenseChange('loan', e.target.checked)}
              />

              {loanToggle ? <>
                <TextField sx={{ mt: 2 }}
                  label="Loan Period in Months"
                  defaultValue={expense.maxPeriod}
                  onChange={(e) => onExpenseChange('maxPeriod', e.target.value)}
                  type="number" fullWidth
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker label="Loan Start Date" sx={{ mt: 2 }}
                    closeOnSelect={true} defaultValue={dayjs(expense.startDate)}
                    value={dayjs(expense.startDate)}
                    onChange={(newValue) => { localExpense.startDate = newValue }}
                  />
                </LocalizationProvider> </>
                : <></>}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography>Enable Schedule</Typography>
              <Switch color="primary"
                defaultValue={localExpense.scheduled}
                defaultChecked={localExpense.scheduled}
                onChange={(e) => onExpenseChange('scheduled', e.target.checked)}
              />
              <br />
              {scheduleToggle ? <ScheduleComponent /> : <></>}
            </Grid>
          </Grid>

          <Button sx={{ mt: 5 }} variant="contained" onClick={handleSubmit} endIcon={<SaveIcon />}>
            Submit
          </Button>
        </DialogContent>
      </Dialog >
    </>
  );
}
