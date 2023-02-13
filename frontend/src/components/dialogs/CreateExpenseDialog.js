// @ts-nocheck
import * as React from "react";
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
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Tooltip from "@mui/material/Tooltip";
import config from "../../resources/config.json";

export default function CreateExpenseDialog({onCreate}) {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState("");
  const [itemDesc, setItemDesc] = React.useState("");
  const [itemCost, setItemCost] = React.useState(0);

  let state = {
    name: itemName,
    description: itemDesc,
    value: itemCost,
    purporse: "unknown",
    location: "unknown"
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    setItemName("");
    setItemDesc("");
    setItemCost(0);
    setOpen(false);
  };

  const handleClose = () => {
    console.log("Sending POST request");
    axios
      .post(config.server.uri + "expenses", state)
      .then((response) => {
        console.log("RESPONSE OK: " + response.data);
        onCreate(response.data);
      })
      .catch((error) => {
        console.log("RESPONSE ERROR: " + error);
      });
    setItemName("");
    setItemDesc("");
    setItemCost(0);
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={"Create New Expense"} placement="top">
        <IconButton
          sx={{ mt: -1.5, ml: -1.5 }}
          color="primary"
          aria-label="add expense"
          size="small"
          align="right"
        >
          <AddIcon fontSize="inherit" onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add regular monthly Expense, for example - Loan, TV, GSM, Car Taxes
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
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
            onChange={(e) => {
              setItemDesc(e.target.value);
            }}
            fullWidth
            variant="standard"
          />
          <FormControl
            fullWidth
            // sx={{ m: 1 }}
            variant="filled"
          >
            <InputLabel htmlFor="cost">Cost</InputLabel>
            <FilledInput
              required
              id="cost"
              value={itemCost}
              onChange={(e) => {
                setItemCost(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>SAVE</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
