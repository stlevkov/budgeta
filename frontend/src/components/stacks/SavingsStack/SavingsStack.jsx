import { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import axios from "axios";
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
import config from "../../../resources/config.json";
import data from "../../../resources/data.json";
import { toast } from "material-react-toastify";

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

async function fetchAllSavings() {
  try {
    const response = await axios.get(config.server.uri + "savings");
    if (response.data !== "") {
      return response.data;
    } else {
      console.log("[SavingsStack]: response data on fetchAll is empty!");
      return data.defaultSavings; // TODO This will not work in case of Edit, the ID must be equal
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    console.log("[SavingsStack]: fetchAllSavings failed with err: ", err.message);
    toast.error("Fetching all savings failed!");
    return data.defaultSavings;
  }
}

const deleteSaving = (saving, savings, setSavings, event) => {
  console.log("[SavingStack]: Will delete item with id: " + saving.id);

  const removeSavingRequest = async () => {
    try {
      const response = await axios.delete(config.server.uri + "savings/" + saving.id);
      if (response.data !== "") {
        removeItemFromState();
        toast.success("Saving removed!");
      } else {
        console.log("[SavingsStack]: response data on remove saving is empty");
        toast.error("Removing of this saving failed!");
      }
    } catch (err) {
      console.log("[SavingsStack]: removeSaving failed with err: ", err.message);
      toast.error("Removing of this saving failed!");
      setSavings(data.defaultSavings);
    }
  };

  const removeItemFromState = () => {
    var array = [...savings];
    var index = array.indexOf(saving);
    if (index !== -1) {
      array.splice(index, 1);
      setSavings(array);
    }
  };
  removeSavingRequest();
};

export default function SavingsStack() {
  const [savings, setSavings] = useState([]);
  const [progress, setProgress] = useState(30); // TODO - Calculate & Update dynamically

  useEffect(() => {
    let fetched = fetchAllSavings();

    fetched.then((result) => {
      setSavings(result);
    });
    setProgress(progress);
    return () => {
      setProgress(0);
      setSavings([]);
    };
  }, []);

  const handleKeyDown = (saving, event) => {
    if (event.key === "Enter") {
      saving.value = event.target.value;
      axios
        .put(config.server.uri + "savings/" + saving.id, saving, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("[SavingStack] RESPONSE OK " + response);
          toast.success("Edited saving stored!");
        })
        .catch((error) => {
          console.log("[SavingsStack] RESPONSE ERROR: " + error);
          toast.error("Edited saving not stored!");
        });
    }
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
              <CreateSavingDialog savings={savings} setSavings={setSavings} />
            </Box>
            <Box width={"100%"} height={"75%"} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography component="h4" align="center" variant="standard" style={{ width: "49%", fontSize: "1rem", color: "#78909c" }}>
                0
              </Typography>
              <Divider orientation="vertical" variant="middle" flexItem />
              <CircularProgressWithLabel sx={{ w: "49%" }} align="right" value={progress} />
            </Box>
          </Item>
        </Grid>
        {savings.map((saving) => {
          return (
            <Grid xs={6} sm={4} md={3} lg={2} xl={1.5} key={saving.name}>
              <Item style={{ height: "70px" }}>
                <Tooltip title={saving.description} placement="top">
                  <Typography style={{ float: "left" }} component="p" align="left" color="#9ccc12" variant="standard">
                    {saving.name}
                  </Typography>
                </Tooltip>

                <Tooltip title={"Remove " + saving.name} placement="top">
                  <IconButton sx={{ mt: -1, mr: -1, float: "right" }} color="primary" aria-label="remove saving" size="small" align="right" onClick={(event) => deleteSaving(saving, savings, setSavings, event)}>
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>

                <SavingsEditable id={`${saving.name}-input`} variant="standard" InputProps={{ disableUnderline: true }} onKeyDown={(event) => handleKeyDown(saving, event)} defaultValue={saving.value} />
              </Item>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
