import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import CreateSavingDialog from "../../components/dialogs/CreateSavingDialog";
import config from '../../resources/config.json';
import data from '../../resources/data.json';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ mt: 1 }} variant="caption" component="div" color="text.secondary">
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

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  width: "12em",
  height: "6em",
  color: theme.palette.text.secondary,
}));

async function fetchAllSavings() {
  try {
    const response = await axios.get(config.server.uri + "savings");
    if (response.data !== "") {
      return response.data;
    } else {
      console.log("Something is wrong");
      return data.defaultSavings; // TODO This will not work in case of Edit, the ID must be equal
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    return data.defaultSavings;
  }
}

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

const deleteSaving = (saving, savings, setSavings, event) => {
  console.log("Will delete item with id: " + saving.id);

  const removeSavingRequest = async () => {
    try {
      const response = await axios.delete(config.server.uri + "savings/" + saving.id);
      if (response.data !== "") {
        removeItemFromState();
      } else {
        console.log("Something is wrong");
      }
    } catch (err) {
      setSavings(data.defaultSavings);
    }
  };

  const removeItemFromState = () => {
    var array = [...savings];
    var index = array.indexOf(saving)
    if (index !== -1) {
      array.splice(index, 1);
      setSavings(array);
    }
  };
  removeSavingRequest();
};

export default function SavingsDirectionStack() {
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

  function addSaving(saving){
    console.log("Will add saving: " + saving);
    savings.push(saving);
    var copy = [...savings]; // make a copy to trigger the re-render
    setSavings(copy);
  };

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
          console.log("[SavingStack] RESPONSE OK " + response.data);
        })
        .catch((error) => {
          console.log("[SavingsStack] RESPONSE ERROR: " + error);
        });
    }
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 2, md: 2 }}
    >
      {/* All Savings */}
      <Item style={{ backgroundColor: '#00000000', width: 130, height: "auto" }}>
        <React.Fragment>
          <Grid container spacing={0}>
            <Grid xs={12} md={11}>
              <Tooltip title="All savings as a % of the Incomes" placement="top">
                <Typography
                  component="p"
                  align="left"
                  color="#9ccc65"
                  variant="standard"
                >
                  SAVINGS
                </Typography>
              </Tooltip>
            </Grid>
            <Grid xs={12} md={1}>
              <CreateSavingDialog onCreate={addSaving} />
            </Grid>
          </Grid>
          <CircularProgressWithLabel sx={{ mt: 1 }} value={progress} />
        </React.Fragment>
      </Item>

      {Object.values(savings).map((saving) => {
        return (
          <Grid container spacing={0}>
            <Item key={saving.name} style={{width: 200, height: "auto"}} sx={{ display: "flex", flexWrap: "wrap" }}>
              <Grid xs={12} md={11}>
                <Tooltip title={saving.description} placement="top">
                  <Typography
                    component="p"
                    align="left"
                    color="#9ccc65"
                    variant="standard"
                  >
                    {saving.name}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid xs={12} md={1}>
                <Tooltip title={"Remove " + saving.name} placement="top">
                  <IconButton
                    sx={{ mt: -1.5 }}
                    color="primary"
                    aria-label="remove saving"
                    size="small"
                    align="right"
                  >
                    <CloseIcon fontSize="inherit" onClick={(event) => deleteSaving(saving, savings, setSavings, event)} />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid xs={1} md={2}>
                <Typography
                  sx={{ paddingRight: "1rem", fontSize: "2rem" }}
                  component="p"
                  align="center"
                >
                  $
                </Typography>
              </Grid>
              <Grid xs={11} md={10}>
                <SavingsEditable
                  id={`${saving.name}-input`}
                  variant="standard"
                  InputProps={{
                    disableUnderline: true,
                  }}
                  onKeyDown={(event) => handleKeyDown(saving, event)}
                  defaultValue={saving.value}
                />
              </Grid>
            </Item>
          </Grid>
        );
      })}
    </Stack>
  );
}
