import { useState } from "react";
import axios from "axios";
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
import AddIcon from "@mui/icons-material/Add";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import config from "../../resources/config.json";
import { toast } from "material-react-toastify";

export default function CreateSavingDialog(props) {
  const { savings, setSavings } = props;
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState(""); // TODO can be property of Object
  const [itemDesc, setItemDesc] = useState(""); // TODO can be property of object
  const [itemAmount, setItemAmount] = useState(0); // TODO can be property of Object

  let savingPayload = {
    name: itemName,
    description: itemDesc,
    value: itemAmount,
    purpose: "unknown",
    location: "unknown",
  };

  function addSaving(saving) {
    console.log("[SavingStack]: Will add saving: " + saving);

    setSavings([...savings, saving]);
  }

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
    if (!itemName) {
      toast.warning("Name is required");
      return 0;
    }
    if (!itemAmount) {
      toast.warning("Amount is required");
      return 0;
    }

    console.log("[CreateSavingDialog]: Sending POST request");
    axios
      .post(config.server.uri + "savings", savingPayload)
      .then((response) => {
        console.log("[CreateSavingDialog]: RESPONSE OK: " + response.data);
        addSaving(response.data);
        toast.success("Saving created!");
      })
      .catch((error) => {
        console.log("[CrateExpenseDialog]: RESPONSE ERROR: " + error);
        toast.error("Unexpected with provided name, already exists!");
      });
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Add new Unexpected for this month" placement="top">
        <IconButton onClick={handleClickOpen} sx={{ mt: -1, mr: -1, float: "right" }} align="right" color="primary" aria-label="add unexpected" size="small">
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Dialog open={open}>
        <DialogTitle>New Saving</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new regular saving, for example - car repairs, clothes, kitchen stuffs</DialogContentText>
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
            variant="filled">
            <InputLabel htmlFor="amnt">Amount</InputLabel>
            <FilledInput
              required
              id="amnt"
              value={itemAmount}
              onChange={(e) => {
                setItemAmount(e.target.value);
              }}
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
