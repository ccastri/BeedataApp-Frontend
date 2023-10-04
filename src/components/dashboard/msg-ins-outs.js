import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, TextField, Card, CardContent, CardHeader, Divider, Grid, IconButton } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReplayIcon from '@mui/icons-material/Replay';
import ErrorSnackbar from '../settings/settings-error-msg';
import dayjs from 'dayjs';
import api from '../../lib/axios';


/**
 * 
 * MsgInsOuts component displays the number of messages sent by agents, visitors and chatbot.
 * 
 * Dependencies: useState, useEffect, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
 *               ResponsiveContainer, Box, TextField, Card, CardContent, CardHeader, Divider, Grid,
 *               IconButton, createTheme, ThemeProvider, LocalizationProvider, AdapterDayjs, DatePicker,
 *               FilterListIcon, ReplayIcon, ErrorSnackbar, dayjs, api
 * Usage: Used to display the number of messages sent by agents, visitors and chatbot in a given time period.
 * 
 */
export const MsgInsOuts = () => {

    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const theme = useTheme();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const fetchMsgCount = async () => {
            const response = await api.get('/api/v1/social/messages', {
                headers: { Authorization: `Bearer ${token}` },
                params: { startFilter: startDate, endFilter: endDate }
            });

            if (response.data.success) {
                const data = response.data.messages;
                let xaxisFormat;

                const calcMonthsDiff = (startDate, endDate) =>
                    startDate && endDate ? ((endDate.getFullYear() - startDate.getFullYear()) * 12)
                        + endDate.getMonth() - startDate.getMonth()
                        - (endDate.getDate() < startDate.getDate() ? 1 : 0) : 0;


                const dateRangeDiff = calcMonthsDiff(new Date(startDate), new Date(endDate));

                if (dateRangeDiff > 2) {
                    xaxisFormat = 'MMM';
                } else {
                    xaxisFormat = 'DD-MMM';
                }

                const extractTimePeriod = (ts, startDate, endDate) =>
                    (startDate && endDate && dateRangeDiff > 2)
                        ? ts.split('T')[0].substring(0, 7)
                        : ts.split('T')[0];


                const groupBy = (arr, key, startDate, endDate) =>
                    arr.reduce((r, v) => {
                        let value = key.split('.').reduce((o, i) => (i === 'ts')
                            ? extractTimePeriod(o[i], startDate, endDate)
                            : (o ? o[i] : null), v);
                        (r[value] = r[value] || []).push(v);
                        return r;
                    }, {});

                let transformedData = data.flatMap(item =>
                    Object.entries(groupBy(item.data.total, 'ts', startDate, endDate))
                        .map(([date, val]) =>
                        ({
                            ts: date,
                            agent: (groupBy(val, 'u.name', startDate, endDate)['agente'] || []).length,
                            visitor: (groupBy(val, 'u.name', startDate, endDate)['visitor'] || []).length,
                            chatbot: (groupBy(val, 'u.name', startDate, endDate)['chatbot'] || []).length
                        })
                        )
                );
                setData({ data: transformedData, xaxisFormat });
            } else {
                setErrorMsg(response.data.message);
            }
        };
        fetchMsgCount();
    }, [startDate, endDate]);
    
    const checkDateValidity = (start, end) => {
        if(end <= start) return "End date must be greater than Start date";
    
        let fourMonthsLater = new Date(start.setMonth(start.getMonth() + 4));
        if(end > fourMonthsLater) return "Data view allowed only up to 4 months";
    
        return null;
    }
    
    const handleFilterClick = () => {
        if(!tempStartDate || !tempEndDate) return;
    
        const start = new Date(tempStartDate);
        const end = new Date(tempEndDate);
        
        const errorMsg = checkDateValidity(start, end);
        if(!errorMsg) {
            setStartDate(tempStartDate);
            setEndDate(tempEndDate);
        } else {
            setErrorMsg(errorMsg);
        }
    };

    const handleReloadClick = () => {
        setTempStartDate(null);
        setTempEndDate(null);
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <Card>
            <Box 
                display="flex"
                alignItems="center"
                sx={{ 
                    padding: '16px',
                    justifyContent: 'space-between',

                }}
            >
                <CardHeader 
                    title="WHATSAPP IN & OUTS"
                    sx={{
                        whiteSpace: 'nowrap',
                    }}
                />
                <Grid container
justifyContent="flex-end">
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={tempStartDate}
                                onChange={setTempStartDate}
                                renderInput={(props) => <TextField {...props}
sx={{ marginRight: '8px' }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={tempEndDate}
                                onChange={setTempEndDate}
                                renderInput={(props) => <TextField {...props} />}
                            />
                            <IconButton 
                                onClick={handleFilterClick}
                                aria-label="Filter"
                            >
                                <FilterListIcon />
                            </IconButton>
                            <IconButton 
                                onClick={handleReloadClick}
                                aria-label='Reload'
                            >
                                <ReplayIcon />
                            </IconButton>
                        </LocalizationProvider>
                    </ThemeProvider>
                </Grid>
            </Box>
            <Divider />
            <CardContent
                sx={{
                    backgroundColor: 'neutral.900',
                    color: '#FFFFFF',
                }}
            >
                <Box
                    sx={{
                        height: 400,
                        position: 'relative'
                    }}
                >
                    <ResponsiveContainer width="100%"
height="100%">
                        <LineChart data={data.data}>
                            <Line type="monotone"
dataKey="agent"
stroke="#8884d8"
strokeWidth={2} />
                            <Line type="monotone"
dataKey="visitor"
stroke="#82ca9d"
strokeWidth={2} />
                            <Line type="monotone"
dataKey="chatbot"
stroke="#ffc658"
strokeWidth={2} />
                            <CartesianGrid stroke="#FFFFFF"
strokeDasharray="5 5" />
                            <XAxis dataKey="ts"
stroke="#FFFFFF"
tickFormatter={(tickItem) => dayjs(tickItem).format(data.xaxisFormat)} />
                            <YAxis stroke="#FFFFFF"
allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                    {errorMsg && (
                        <ErrorSnackbar 
                            errorMessage={errorMsg}
                            container={'dialog'}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        />
                    )}
                </Box>
            </CardContent>
            <Divider />
        </Card>
    );
}; 
