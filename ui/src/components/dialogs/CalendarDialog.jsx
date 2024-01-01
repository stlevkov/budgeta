import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Divider } from '@mui/material';
import { DashboardContext } from '../../utils/AppUtil';

export default function CalendarDialog({ open, setOpen }) {
    const dashboardState = useContext(DashboardContext);
    const [selectedMonth, setSelectedMonth] = useState(dayjs()); // Initialize with current date

    const handleClose = () => {
        setOpen(false);
    };

    const handleMonthChange = (newMonth) => {
        console.log('%%% newMonth: ', newMonth)
        const month = newMonth.format('MMMM');
        const year = Number(newMonth.format('YYYY'));
        dashboardState.handleStateChanged(month, year);
        setOpen(false);
    };

    useEffect(() => {
        console.log("[Calendar Dialog][UseEffect] Initializing Component.");
    }, [open, dashboardState]);

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{"Pick Dashboard from the history"}</DialogTitle>
            <Divider />
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        maxDate={dayjs()}
                        minDate={dayjs('2022-01')}
                        views={['month', 'year']}
                        openTo="month"
                        monthsPerRow={3}
                        onMonthChange={handleMonthChange}
                    />
                </LocalizationProvider>
            </DialogContent>
        </Dialog>
    );
}
