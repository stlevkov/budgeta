import { useEffect, useState, useContext } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { ExpensesContext } from "../../utils/AppUtil";
import { Divider, Grid } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" key={index} hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const ExpenseEditable = styled(TextField)(({ theme }) => ({
  "& .MuiInput-root": {
    border: "none",
    overflow: "hidden",
    fontSize: "3.3rem ",
    align: "center",
    marginTop: "10px",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      border: "none",
    },
    "& .MuiInputBase-root": {
      height: "3.5rem",
    },
  },
}));

/**
 * This dialog is intended to provide Loan information as well as grouping information
 * 
 * @returns 
 */
export default function ViewExpenseDialog({ expense }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeExpense = (expense, event) => {
    expense.value = Number(event.target.value);

  };

  const handleKeyDown = (expense, event) => {
    if (event.key === "Enter") {
      expense.value = Number(event.target.value);
      expensesState.updateExpense(expense);
    }
  };

  const removeExpense = (expense, event) => {
    console.log("[ViewExpensesDialog]: Will delete item with id: " + expense.id);
    expensesState.removeExpense(expense);
  };

  const tabPanels = []; // TODO check with Income dialog to implement the tabs for grouped expenses

  return (
    <>
      <Tooltip title={"See Details"} placement="top">
        <IconButton onClick={handleClickOpen} sx={{ float: "right", mt: -1, mr: -1 }} color="primary" aria-label="See Details" size="small" align="right">
          <InfoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ float: "left" }}>
          Expense Details
          <IconButton sx={{ float: "right" }} onClick={handleClose} color="primary" aria-label="remove expense" size="small" align="right">
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </DialogTitle>
        <Divider/>
        <DialogContent>
            <Tooltip title={"Remove " + expense.name} placement="top">
              <IconButton sx={{ mt: -1, mr: -1, float: "right" }} onClick={(event) => removeExpense(expense, event)} color="primary" aria-label="remove expense" size="small" align="right">
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>

            <TextField sx={{ mb: 2 }}
              label="Edit Name"
              value={expense.name}
              onChange={(e) => handleChange('name', e.target.value)}
              fullWidth
            />
            <TextField sx={{ mb: 2 }}
              label="Edit Description"
              value={expense.description}
              onChange={(e) => handleChange('description', e.target.value)}
              fullWidth
            />
        </DialogContent>
      </Dialog>
    </>
  );
}
