import { useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import SavingsIcon from '@mui/icons-material/Savings';
import { toast } from "material-react-toastify";
import { BalanceAccountContext } from "../../utils/AppUtil";
import { FilledInput, FormControl, Grid, InputLabel, Switch, Typography } from "@mui/material";

export default function CreateBalanceAccountDialog() {
  const balanceAccountState = useContext(BalanceAccountContext);

  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemAmount, setItemAmount] = useState(0);
  const [itemActive, setItemActive] = useState(false);
  const [itemPrimary, setItemPrimary] = useState(false);

  let balanceAccountPayload = {
    name: "",
    description: "",
    value: 0,
  };

  const localClean = () => {
    setItemName("");
    setItemDesc("");
    setItemAmount(0);
    setItemActive(false);
    setItemPrimary(false);
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
      toast.warning("Account Name is required");
      return 0;
    }
    console.log('Amount === ', itemAmount)
    balanceAccountPayload.name = itemName;
    balanceAccountPayload.description = itemDesc;
    balanceAccountPayload.value = itemAmount;
    balanceAccountPayload.active = itemActive;
    balanceAccountPayload.primary = itemPrimary;
    balanceAccountState.addBalanceAccount(balanceAccountPayload);

    localClean();
  };

  return (
    <>
      <Tooltip title={"Add New Balance Account"} placement="top">
        <IconButton onClick={handleClickOpen} style={{ float: "right", marginTop: "-40px" }} color="primary" aria-label="add account" size="small">
          <SavingsIcon fontSize="large" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Balance Account</DialogTitle>
        <DialogContent>
          <DialogContentText>Add new Account, for example - saving, investing, family or personal account.
            This account is where your target savings goes each month. It can be even a jar or a piggy bank.
          </DialogContentText>
          <FormControl fullWidth variant="standard">
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
          </FormControl>
          <FormControl fullWidth variant="standard">
          <TextField
            required
            autoFocus
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            variant="standard"
            value={itemDesc}
            onChange={(e) => {
              setItemDesc(e.target.value);
            }}
          />
          </FormControl>
          <Grid container spacing={6} fullWidth>
            <Grid item xs={6} sm={6}>
              <Typography>Active - If enabled, will be used in calculations for achieving the targets.
              </Typography>
              <Switch color="primary"
                defaultValue={itemActive}
                onChange={(e) => setItemActive(e.target.checked)}
              />
            </Grid>
            <Grid item xs={6} sm={6}>
              <Typography>Primary - There should be one primary account on which the system will make transactions.
              </Typography>
              <Switch color="primary"
                defaultValue={itemPrimary}
                onChange={(e) => setItemPrimary(e.target.checked)}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth variant="filled">
              <InputLabel htmlFor="amnt">Initial Amount</InputLabel>
              <FilledInput type="number" required id="amount" value={itemAmount} onChange={(e) => { setItemAmount(e.target.value) }} />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleClose}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
