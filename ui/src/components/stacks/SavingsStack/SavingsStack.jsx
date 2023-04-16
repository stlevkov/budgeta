import { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import CreateSavingDialog from "../../dialogs/CreateSavingDialog";
import { UnexpectedContext } from "../../../utils/AppUtil";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: 6,
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const SavingsEditable = styled(TextField)(({ theme }) => ({
  "& .MuiInput-root": {
    border: "none",
    overflow: "hidden",
    fontSize: "2rem ",
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-focused": {
      backgroundColor: "transparent",
      border: "none",
    },
  },
}));

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-block", width: props.sx.w, textAlign: "center" }}>
      <CircularProgress size={"2.4em"} variant="determinate" {...props} />
      <Box sx={{ top: -5, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="caption" fontSize="0.8em" component="div" color="text.secondary" sx={{ top: -5, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function SavingsStack() {
  const [unexpecteds, setSavings] = useState([]);
  const [progress, setProgress] = useState(30); // TODO - Calculate & Update dynamically
  const unexpectedState = useContext(UnexpectedContext);

  const handleUnexpectedStateChange = (newState) => {
    // Do something with the new state
    console.log("DO SOMETHING Unexpected in UNEXPECTED has changed:", newState);
    setSavings(newState);
  };

  useEffect(() => {
    setSavings(unexpectedState.getState());
    setProgress(progress);

    unexpectedState.addListener(handleUnexpectedStateChange);

    return () => {
      setProgress(0);
      setSavings([]);
      unexpectedState.removeListener(handleUnexpectedStateChange);
    };
  }, [unexpectedState]);

  const onUnexpectedChange = (unexpected, event) => {
    unexpected.value = Number(event.target.value);
    unexpectedState.onChange(unexpected);
  };

  const handleKeyDown = (unexpected, event) => {
    if (event.key === "Enter") {
      unexpected.value = Number(event.target.value);
      unexpectedState.updateUnexpected(unexpected);
    }
  };

  const deleteSaving = (unexpected, event) => {
    console.log("[SavingStack]: Will delete item with id: " + unexpected.id);
    unexpectedState.removeUnexpected(unexpected);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container disableEqualOverflow spacing={{ xs: 2, md: 2 }}>
        <Grid xs={6} sm={4} md={3} lg={2} xl={1.5}>
          <Item style={{ backgroundColor: "#00000000", height: "70px" }}>
            <Box width={"100%"} height={"12%"}>
              <Tooltip title="Unexpected expenses for this month as a % from the Incomes" placement="top">
                <Typography style={{ float: "left" }} component="p" align="left" color="#9ccc12" variant="standard">
                  UNEXPECTED
                </Typography>
              </Tooltip>
              <CreateSavingDialog />
            </Box>
            <Box width={"100%"} height={"75%"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography component="h4" align="center" variant="standard" style={{ width: "49%", fontSize: "1rem", color: "#78909c" }}>
                {unexpectedState.getSumUnexpected()}
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <CircularProgressWithLabel sx={{ w: "49%" }} align="right" value={progress} />
            </Box>
          </Item>
        </Grid>
        {unexpecteds.map((unexpected) => {
          return (
            <Grid xs={6} sm={4} md={3} lg={2} xl={1.5} key={unexpected.name}>
              <Item style={{ height: "70px" }}>
                <Tooltip title={unexpected.description} placement="top">
                  <Typography style={{ float: "left" }} component="p" align="left" color="#9ccc12" variant="standard">
                    {unexpected.name}
                  </Typography>
                </Tooltip>

                <Tooltip title={"Remove " + unexpected.name} placement="top">
                  <IconButton sx={{ mt: -1, mr: -1, float: "right" }} color="primary" aria-label="remove unexpected" size="small" align="right" onClick={(event) => deleteSaving(unexpected, unexpecteds, setSavings, event)}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>

                <SavingsEditable id={`${unexpected.name}-input`} variant="standard" InputProps={{ disableUnderline: true }} onKeyDown={(event) => handleKeyDown(unexpected, event)} onChange={(e) => onUnexpectedChange(unexpected, e)} defaultValue={unexpected.value} />
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
