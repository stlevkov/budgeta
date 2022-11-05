import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

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
      console.log(response.data); //Prints out my three objects in an array in my console. works great
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

function SavingsDirectionStack() {
  const [savings, setSavings] = useState({});
  useEffect(() => {
    let fetched = fetchAllSavings();

    fetched.then((result) => {
      setSavings(result);
    });
  }, []);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 2, md: 2 }}
    >
      {Object.values(savings).map((saving) => {
        return (
          <Item key={saving.name}>
            <React.Fragment>
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
              <Typography
                sx={{ mt: 1 }}
                component="p"
                color="#b0b0b0"
                align="left"
                variant="h5"
              >
                $ {saving.value}
              </Typography>
            </React.Fragment>
          </Item>
        );
      })}
    </Stack>
  );
}

export default SavingsDirectionStack;
