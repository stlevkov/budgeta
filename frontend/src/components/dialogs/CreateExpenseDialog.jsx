import { useState, useContext } from "react";
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
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "material-react-toastify";
import { createExpense } from "../../api/RestClient";
import { ExpensesContext } from "../../utils/AppUtil";

export default function CreateExpenseDialog() {
  const expensesState = useContext(ExpensesContext);

  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemCost, setItemCost] = useState(0);

  let expensePayload = {
    name: itemName,
    description: itemDesc,
    value: itemCost,
    purpose: "unknown",
    location: "unknown",
  };

  function addExpense(expense) {
    console.log("[CrateExpenseDialog]: Will add expense: ", expense);
    let expenses = expensesState.getState();
    expensesState.setState([...expenses, expense]);
  }

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
    if (!itemName) {
      toast.warning("Name is required");
      return 0;
    }
    if (!itemCost) {
      toast.warning("Cost is required");
      return 0;
    }

    createExpense(expensePayload);
    addExpense(expensePayload);

    setItemName("");
    setItemDesc("");
    setItemCost(0);
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title={"Create New Expense"} placement="top">
        <IconButton onClick={handleClickOpen} sx={{ mt: -1, mr: -1, float: "right" }} align="right" color="primary" aria-label="add expense" size="small">
          <AddIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Dialog open={open}>
        <DialogTitle>New Expense</DialogTitle>
        <DialogContent>
          <DialogContentText>Add regular monthly Expense, for example - Loan, TV, GSM, Car Taxes</DialogContentText>
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
            <InputLabel htmlFor="cost">Cost</InputLabel>
            <FilledInput
              required
              id="cost"
              value={itemCost}
              onChange={(e) => {
                setItemCost(e.target.value);
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
