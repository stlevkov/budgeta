import * as React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import axios from "axios";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import Divider from "@mui/material/Divider";
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

function CircularProgressWithLabel(props) {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress size="8rem" variant="determinate" {...props} />
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
                <Typography style={{ fontSize: "2rem" }} sx={{ mt: 1 }} variant="caption" component="div" color="text.secondary">
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

export default function TargetStack({ myData }) {
    const [progress, setProgress] = useState(85); // TODO - Calculate & Update dynamically 

    useEffect(() => {
        setProgress(progress);
        return () => {
            setProgress(0);
        };
    }, []);

    return (
        <div>
            <Grid container spacing={0}>
                <Grid xs={10}>
                    TARGET#
                </Grid>
                <Grid xs={2}>
                    $19345
                </Grid>
            </Grid>
            <Divider />
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CircularProgressWithLabel sx={{ mt: 1 }} value={progress} />
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="2vh"
            >
                <Typography
                    component="p"
                    align="left"
                    color="green"
                    variant="standard"
                    fontSize="1.2rem"
                    style={{ marginTop: 6, marginRight: 6 }}
                >
                    $ 15673
                </Typography>
            </Box>
            <Divider />
            <Grid container spacing={0}>
                <Grid xs={9}>
                    Estimated
                </Grid>
                <Grid xs={3}>
                    25.04.2026
                </Grid>
            </Grid>
            <Grid container spacing={0}>
                <Grid xs={7}>
                <Typography
                        component="p"
                        align="left"
                        color="lightGray"
                        variant="standard"
                        fontSize="1.3rem"
                        style={{ marginTop: 0, marginRight: 0 }}
                    >
                        Earnings per day
                    </Typography>
                    <Typography
                        component="p"
                        align="left"
                        color="lightBlue"
                        variant="standard"
                        fontSize="1.2rem"
                        style={{ marginTop: 1, marginRight: 1 }}
                    >
                        $ 28
                    </Typography>
                </Grid>
                <Grid xs={1}></Grid>
                <Grid xs={4}></Grid>
            </Grid>
        </div>
    );
}
