import * as React from "react";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
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
import Tooltip from "@mui/material/Tooltip";
import config from '../../resources/config.json';

export default function CreateSavingDialog({onCreate, handleErrorMessageOpen, errorMessage}) {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState(""); // TODO can be property of Object
  const [itemDesc, setItemDesc] = React.useState(""); // TODO can be property of object
  const [itemAmount, setItemAmount] = React.useState(0); // TODO can be property of Object

  let state = {
    name: itemName,
    description: itemDesc,
    value: itemAmount,
    purpose: "unknown",
    location: "unknown"
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
      .post(config.server.uri + "savings", state)
      .then((response) => {
        console.log("RESPONSE OK: " + response.data);
        onCreate(response.data);
      })
      .catch((error) => {
        console.log("RESPONSE ERROR: " + error);
        errorMessage("Unable to add new Saving. Reason: " + error.message);
        handleErrorMessageOpen();
      });
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Add new Unexpected for this month" placement="top">
        <IconButton sx={{mt: -1, mr: -1, float: 'right'}} align="right" color="primary" aria-label="add unexpected" size="small" >
          <AddIcon fontSize="inherit" onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Saving</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new regular saving, for example - car repairs, clothes, kitchen stuffs
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
