import React, {useState, useContext} from 'react';
import { Context } from '../helper/Store';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';


function Inputs() {
    const [state, setState] = useContext(Context);  


    return(
        <>
            <Box
            component="form"
            sx={{
                width: '96vw',
                m: "2vw",
            }}
            noValidate
            autoComplete="off"
            >
                <Stack direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}>
                    <TextField id="outlined-basic" 
                    label="Address" 
                    variant="filled" 
                    sx={{ mt:"4vh" }}/>
                    <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    >
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                            label="from"
                            inputFormat="DD/MM/YYYY"
                            value={state.startDate}
                            onChange={(newValue) => {
                                setState(state => ({...state,startDate: new Date(newValue)}))
                                console.log("datefrom ", new Date(newValue));
                            }}
                            renderInput={(params) => <TextField variant="filled" {...params} />}
                            />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                            label="to"
                            inputFormat="DD/MM/YYYY"
                            value={state.endDate}
                            onChange={(newValue) => {
                                setState(state => ({...state,endDate:new Date(newValue + 24*3600*1000)}))
                                console.log("dateTo" , new Date(newValue + 24*3600*1000));
                            }}
                            renderInput={(params) => <TextField variant="filled" {...params} />}
                            />
                        </LocalizationProvider>
                    </Stack>
                    <Button variant="contained" 
                    onClick={() => {
                        console.log("clicked");
                    }}>
                        Calculate
                    </Button>
                </Stack>
            </Box>
        </>
    );
}

export default Inputs