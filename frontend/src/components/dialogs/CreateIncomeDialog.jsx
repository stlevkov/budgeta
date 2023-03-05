import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FilledInput from "@mui/material/FilledInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import Tooltip from "@mui/material/Tooltip";
import config from '../../resources/config.json';
import AddCardIcon from '@mui/icons-material/AddCard';

export default function CreateIncomeDialog({onCreate}) {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState(""); // TODO can be property of Object
  const [itemDesc, setItemDesc] = React.useState(""); // TODO can be property of object
  const [itemAmount, setItemAmount] = React.useState(0); // TODO can be property of Object

  let state = {
    name: itemName,
    description: itemDesc,
    value: itemAmount,
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setOpen(false);
  };

  const handleClose = () => {
    console.log("Sending POST request");
    axios
      .post(config.server.uri + "incomes", state)
      .then((response) => {
        console.log("RESPONSE OK: " + response.data);
        onCreate(response.data);
      }).catch((error) => {
        console.log("Catch ERROR: " + error);
      });
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={"Add New Income"} placement="top">
        <IconButton style={{float: "right", marginTop: "-40px"}} color="primary" aria-label="add income" size="small">
          <AddCardIcon fontSize="large" onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New income</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new income, for example - salary, sales
          </DialogContentText>
          <TextField required autoFocus margin="dense" id="name" label="Name" type="text" variant="standard"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }} />
          <TextField required fullWidth variant="standard" autoFocus margin="dense" id="desc" label="Description" type="text"
            value={itemDesc}
            onChange={(e) => {
              setItemDesc(e.target.value);
            }}/>
          <FormControl fullWidth variant="filled" >
            <InputLabel htmlFor="amnt">Amount</InputLabel>
            <FilledInput required id="amnt"
              value={itemAmount}
              onChange={(e) => {
                setItemAmount(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }/>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Finish</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
