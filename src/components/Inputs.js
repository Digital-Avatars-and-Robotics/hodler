import React, {useState, useContext} from 'react';
import { Context } from '../helper/Store';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


function Inputs() {
    const [state, setState] = useContext(Context);  
    return(
        <>
            <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            >
                <TextField id="outlined-basic" label="Address" variant="outlined" />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    label="from"
                    inputFormat="DD/MM/YYYY"
                    value={state.startDate}
                    onChange={(newValue) => {
                        setState(state => ({...state,startDate: newValue }))
                        console.log("datefrom ", newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                    label="to"
                    inputFormat="DD/MM/YYYY"
                    value={state.endDate}
                    onChange={(newValue) => {
                        setState(state => ({...state,endDate: newValue }))
                        console.log("dateTo" , newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>  
            </Box>
        </>
    );
}

export default Inputs