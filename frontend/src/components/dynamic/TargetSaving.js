import * as React from "react";
import axios from "axios";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import config from "../../resources/config.json";

export default function InputTargetSaving({ calculateCostAnalytics }) {
  const [targetSaving, setTargetSaving] = React.useState(0);

  useEffect(() => {
    const fetchTargetSaving = async () => {
      console.log("Fetching activated from useEffect");
      try {
        const response = await axios.get(config.server.uri + "costAnalytics");
        if (response.data !== "") {
          setTargetSaving(response.data.targetSaving);
        } else {
          console.log("Something is wrong");
          setTargetSaving(0);
        }
      } catch (err) {
        console.log("[TargetSavings] - catch failed. Reason: " + err); // TODO makes tests fail because of network delay response
        setTargetSaving(0);
      }
    };
    fetchTargetSaving();
    return () => {
      console.log("clearing the target saving state in return");
      setTargetSaving(0);
    };
  }, []);

  // having event here is important, otherwise, the component will not be editable
  // remark: Dont use defaultValue for valueChange, use the value instead and handle the event properly
  const handleChange = (event) => {
    console.log("Handle change: " + event.target.value);
    setTargetSaving(event.target.value);
    calculateCostAnalytics(event.target.value);
  };

  const handleKeyDown = (event) => {
    console.log("Evvent");
    if (event.key === "Enter") {
      console.log("Sending POST request with data: " + targetSaving);
      axios
        .put(config.server.uri + "costAnalytics/targetSaving", targetSaving, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("RESPONSE OK: " + JSON.stringify(response.data));
          // Handle data
          setTargetSaving(response.data.targetSaving);
        })
        .catch((error) => {
          console.log("RESPONSE ERROR: " + error);
        });
    }
  };

  return (
    <div>
      <Grid container spacing={0}>
        <Grid xs={12} md={8}>
          <Typography
            component="p"
            align="left"
            color="yellow"
            variant="standard"
            fontSize="1em"
            style={{ marginTop: 6, marginRight: 6 }}
          >
            TARGET SAVING
          </Typography>
        </Grid>
        <Grid xs={12} md={4}>
          <TextField
            hiddenLabel
            id="inputTargetSavingField"
            variant="filled"
            size="small"
            fontSize="1.2em"
            style={{ width: 80 }}
            defaultValue={targetSaving}
            value={targetSaving}
            onChange={handleChange}
            onKeyDown={(event) => handleKeyDown(event)}
          />
        </Grid>
      </Grid>
    </div>
  );
}
