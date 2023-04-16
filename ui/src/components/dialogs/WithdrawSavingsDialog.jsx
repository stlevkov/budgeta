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
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import Typography from "@mui/material/Typography";

export default function WithdrawSavingsDialog({onCreate}) {
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
    <div>
     <Tooltip  title={<Typography fontSize="1.3em">Change the Account Amount</Typography>} placement="top">
        <IconButton
          sx={{ mt: -1.5, ml: -1.5 }}
          color="primary"
          aria-label="add income"
          size="small"
          align="right"
        >
          <PriceChangeIcon fontSize="large" onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Account Savings Amount</DialogTitle>
        <DialogContent>
          <DialogContentText>Change the Account Savings amount. For example, if the target is achieved and the money are spent
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
            <InputLabel htmlFor="amnt">Amount</InputLabel>
            <FilledInput
              required
              id="amnt"
              value={itemAmount}
              onChange={(e) => {
                setItemAmount(e.target.value);
              }}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
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
