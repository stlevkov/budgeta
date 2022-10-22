import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';



export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState('')
  const [itemDesc, setItemDesc] = React.useState('')
  const [itemCost, setItemCost] = React.useState(0)

  /**
   * {
    "name" : "Stoycho",
    "description" : "Main Salary Income",
    "value" : 4500
    }
   */
  let state = {
    name: itemName,
    description: itemDesc,
    value: itemCost
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setItemName('')
    setItemDesc('')
    setItemCost(0)
    setOpen(false);
  };

  const handleClose = () => {
   // console.log(JSON.stringify(state))
    // Using Axios - ensure you first install the package
    console.log("Sending POST request");
    axios.post('http://localhost:8080/api/expenses', state)
      .then((response) => {
        console.log("RESPONSE OK: " + response.data);
        // Handle data
      })
      .catch((error) => {
        console.log("RESPONSE ERROR: " + error);
      })
    setItemName('')
    setItemDesc('')
    setItemCost(0)
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="inherit" onClick={handleClickOpen}>
        Add Expense
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add regular monthly Expense which automatically will be calculated
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={itemName}
            onChange={e => {
              setItemName(e.target.value)
            }}
            //fullWidth
            variant="standard"
          />
          <TextField
            required
            autoFocus
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            value={itemDesc}
            onChange={e => {
              setItemDesc(e.target.value)
            }}
            fullWidth
            variant="standard"
          />
          <FormControl fullWidth
            // sx={{ m: 1 }} 
            variant="filled"
          >
            <InputLabel htmlFor="cost">Cost</InputLabel>
            <FilledInput
              required
              id="cost"
              value={itemCost}
              onChange={e => {
                setItemCost(e.target.value)
              }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Finish</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
