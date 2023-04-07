import { useState, useContext } from "react";
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
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddCardIcon from "@mui/icons-material/AddCard";
import { toast } from "material-react-toastify";
import RestClient from "../../api/RestClient";
import { IncomesContext } from "../../utils/AppUtil";
import config from "../../resources/config.json";

export default function CreateIncomeDialog() {
  const incomeState = useContext(IncomesContext);

  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemAmount, setItemAmount] = useState(0);
  const restClient = new RestClient(config.api.incomesEndpoint); // TODO move to state

  let incomePayload = {
    name: itemName,
    description: itemDesc,
    value: itemAmount,
  };

  const localClean = () => {
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    localClean();
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

    restClient.genericCreate(incomePayload); // TODO move to state
    incomeState.addIncome(incomePayload);

    localClean();
  };

  return (
    <>
      <Tooltip title={"Add New Income"} placement="top">
        <IconButton onClick={handleClickOpen} style={{ float: "right", marginTop: "-40px" }} color="primary" aria-label="add income" size="small">
          <AddCardIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New income</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new income, for example - salary, sales</DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            variant="standard"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
          <TextField
            required
            fullWidth
            variant="standard"
            autoFocus
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            value={itemDesc}
            onChange={(e) => {
              setItemDesc(e.target.value);
            }}
          />
          <FormControl fullWidth variant="filled">
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
          <Button onClick={handleClose}>Finish</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
