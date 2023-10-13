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
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { toast } from "material-react-toastify";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';

const BalanceTransactionType = {
  WITHDRAW: "WITHDRAW",
  DEPOSIT: "DEPOSIT",
};

//TODO Replace by actual object BalanceTransaction.ts
let balanceTransaction = {
  name: "Balance update by User",
  description: "",
  value: 0,
  type: {},
};

export default function CreateBalanceTransactionDialog({balanceAccount}) {
  const [open, setOpen] = React.useState(false);
  const [description, setDescription] = React.useState('');
  const [amount, setAmount] = React.useState(0);
  const [type, setType] = React.useState(BalanceTransactionType.DEPOSIT);

  const newBalanceTransaction = (balanceTransaction) => {
    balanceAccount.newTransaction(balanceTransaction);
  };

  const clearStates = () => {
     setDescription('');
     setAmount(0);
     setType(BalanceTransactionType.DEPOSIT);
     setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCancel = () => {
    clearStates();
  };

  const handleClose = () => {
    console.log('amount', amount)
    if (amount <= 0) {
      toast.warn("Please specify Amount");
      return 0
    }
    balanceTransaction.description = description;
    balanceTransaction.value = amount;
    balanceTransaction.type = type;
    newBalanceTransaction(balanceTransaction);
    clearStates();
  };
  

  return (
    <>
      <Tooltip title={"New Balance Transcation"} placement="top">
        <IconButton onClick={handleClickOpen} style={{ float: "right", marginTop: "-40px" }} color="primary" aria-label="add income" size="small">
          <AccountBalanceWalletIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Balance Transaction</DialogTitle>
        <DialogContent>
          <Stack direction="column" spacing={2}>
            <DialogContentText>
              Make new Transaction to the Balance Account - Withdraw or Deposit
            </DialogContentText>

            <FormControl fullWidth variant="standard">
              <InputLabel id="demo-simple-select-label">Transaction Type</InputLabel>
              <Select labelId="demo-simple-select-label" id="demo-simple-select" label="Transaction Type"
                value={type} onChange={(e) => { setType(e.target.value) }} >
                <MenuItem value={'DEPOSIT'}>Deposit</MenuItem>
                <MenuItem value={'WITHDRAW'}>Withdraw</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth variant="filled">
              <TextField required fullWidth variant="standard" autoFocus margin="dense" id="desc" label="Description" type="text"
                value={description} onChange={(e) => { setDescription(e.target.value) }} />
            </FormControl>

            <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="amnt">Amount</InputLabel>
              <FilledInput required id="amount" value={amount} onChange={(e) => { setAmount(e.target.value) }} />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
