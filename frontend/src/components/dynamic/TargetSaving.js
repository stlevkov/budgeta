import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import axios from "axios";
import { useState, useEffect } from "react";


export default function InputTargetSaving() {
    const [targetSaving, setTargetSaving] = React.useState('');

    const handleTargetSavingChange = (e) => {
        console.log("Handle Target Saving Change to dynamically set the values of the dashboard")
        setTargetSaving(e.target.value)
    };

    useEffect(() => {
        const fetchTargetSaving = async () => {
            console.log("Fetching activated from useEffect")
            try {
                const response = await axios.get("http://localhost:8080/api/costAnalytics");
                if (response.data !== "") {
                    setTargetSaving(response.data.targetSaving);
                } else {
                    console.log("Something is wrong");
                }
            } catch (err) {
                console.log(err); // TODO makes tests fail because of network delay response
                // setTargetSaving(defaultExpenses);
            }
        };
        fetchTargetSaving();
        return () => {
            console.log("clearing the target saving state in return")
            setTargetSaving('');
        };
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            console.log("Sending POST request with data: " + targetSaving);
            axios.put('http://localhost:8080/api/costAnalytics', targetSaving, {
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((response) => {
                    console.log("RESPONSE OK: " + JSON.stringify(response.data));
                    // Handle data
                    setTargetSaving(response.data.targetSaving)
                })
                .catch((error) => {
                    console.log("RESPONSE ERROR: " + error);
                })
        }
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <div>
                <FormControl fullWidth="sm" sx={{ m: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-amount">Target Saving</InputLabel>
                    <OutlinedInput
                        id="outlined-adornment-amount"
                        value={targetSaving}
                        onChange={handleTargetSavingChange}
                        onKeyDown={handleKeyDown}
                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        label="Target Saving"
                    />
                </FormControl>
            </div>
        </Box>
    );
}
