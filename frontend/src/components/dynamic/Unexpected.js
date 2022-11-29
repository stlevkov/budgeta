import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useEffect } from "react";
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';

const defaultUnexpected = 900;

export default function InputUnexpected({ myData }) {
    const [unexpected, setUnexpected] = React.useState(defaultUnexpected);

    useEffect(() => {
        setUnexpected(myData);
    }, [myData]);

    const handleUnexpectedChange = (e) => {
        console.log(
            "Handle Unexpected Change to dynamically set the values of the dashboard"
        );
        setUnexpected(e.target.value);
    };

    const handleKeyDown = (event) => {
        console.log("Sending POST request with data: " + unexpected);
        axios
            .put("http://localhost:8787/api/costAnalytics/unexpected", unexpected, {
                headers: {
                    "Content-Type": "application/json",
                },
            })
            .then((response) => {
                console.log("RESPONSE OK: " + JSON.stringify(response.data));
                // Handle data
                setUnexpected(response.data.unexpected);
            })
            .catch((error) => {
                console.log("RESPONSE ERROR: " + error);
            });
    };

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            <div>
                <FormControl fullWidth="sm" sx={{ m: 0 }}>
                    <Grid container spacing={0}>
                        <Grid xs={6} md={12}>
                            <Tooltip title="Unexpected spendings for the month (exceeding 200)" placement="top">
                                <Typography
                                    component="p"
                                    color="orange"
                                    fontSize="1.5em"
                                    variant="standard"
                                    align="left"
                                >
                                    UNEXPECTED
                                </Typography>
                            </Tooltip>
                        </Grid>
                        <Grid xs={6} md={2}>
                            <Typography
                                sx={{ mt: 1 }}
                                component="p"
                                color="#b0b0b0"
                                fontSize="3em"
                                align="left"
                            >
                                $
                            </Typography>
                        </Grid>
                        <Grid xs={6} md={10}>
                            <EditText
                                id="unexpected-field"
                                defaultValue={defaultUnexpected}
                                value={unexpected}
                                onChange={handleUnexpectedChange}
                                onSave={handleKeyDown}
                                style={{
                                    textAlign: "left",
                                    fontSize: '3em',
                                    color: "#b0b0b0",
                                    align: "left",
                                    marginTop: "5px",
                                    marginLeft: "-10px",
                                    borderRadius: "4px",
                                }}
                            />
                        </Grid>
                    </Grid>
                </FormControl>
            </div>
        </Box>
    );
}
