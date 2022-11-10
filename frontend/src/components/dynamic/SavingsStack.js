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

const defaultSavings = {
  0: { name: "CAR REPAIRS", description: "Test", value: "150" },
  1: { name: "APARTMENT REPAIRS", description: "Apartment", value: "80" },
  2: { name: "CLOTHES", description: "Clothes saving", value: "150" },
  3: { name: "TOYS", description: "Toys", value: "20" },
  4: { name: "MEDICAL", description: "Medical", value: "75" },
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
    const response = await axios.get("http://localhost:8080/api/savings");
    if (response.data !== "") {
      return response.data;
    } else {
      console.log("Something is wrong");
      return defaultSavings;
    }
  } catch (err) {
    //console.log(err); TODO makes tests fail because of network delay response
    return defaultSavings;
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

export default function SavingsDirectionStack() {
  const [savings, setSavings] = useState({});
  useEffect(() => {
    let fetched = fetchAllSavings();

    fetched.then((result) => {
      setSavings(result);
    });
  }, []);

  const handleKeyDown = (saving, event) => {
    if (event.key === "Enter") {
      saving.value = event.target.value;
      axios
        .put(`http://localhost:8080/api/savings/${saving.id}`, saving, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(
            "[SavingStack] RESPONSE OK " + JSON.stringify(response.data)
          );
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
      {Object.values(savings).map((saving) => {
        return (
          <Grid container spacing={0}>
            <Item key={saving.name} sx={{ display: "flex", flexWrap: "wrap" }}>
              <Grid xs={12} md={12}>
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
