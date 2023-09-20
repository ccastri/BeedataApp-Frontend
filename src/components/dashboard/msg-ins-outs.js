import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, TextField, Card, CardContent, CardHeader, Divider, Grid, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterListIcon from '@mui/icons-material/FilterList';
import ReplayIcon from '@mui/icons-material/Replay';
import ErrorSnackbar from '../settings/settings-error-msg';
import dayjs from 'dayjs';
import api from '../../lib/axios';

const theme = createTheme({
    components: {
        MuiPickersBasePicker: {
            styleOverrides: {
                container: { color: 'white' },
            },
        },
        MuiButton: {
            styleOverrides: {
                textPrimary: {
                    color: 'white'
                }
            },
        }
    },
});

export const MsgInsOuts = () => {

    const [tempStartDate, setTempStartDate] = useState(null);
    const [tempEndDate, setTempEndDate] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        const fetchMsgCount = async () => {
            const response = await api.post('/api/v1/social/messages',
                { startFilter: startDate, endFilter: endDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('startDate', startDate);
            console.log('endDate', endDate);
            if (response.data.success) {
                let data = response.data.msgsCount;

                let totalSum = data.reduce((sum, item) => sum + item.data.total.length, 0);
;
                let xaxisFormat = 'DD-MMM';
                if (totalSum > 31) {
                    // map all the date poins on the xaxis but only put labels on the last day of every month
                }

                console.log('data : ', data);
                let groupBy = (array, key) => {
                    return array.reduce((result, currentValue) => {
                        let value = key.split('.').reduce((o, i, idx, array) => {
                            if (array[idx] === "ts") {
                                return o[i].split('T')[0];
                            }
                            return o ? o[i] : null;
                        }, currentValue);
                        (result[value] = result[value] || []).push(currentValue);
                        return result;
                    }, {});
                };
                let transformedData = data.flatMap(item =>
                    Object.entries(groupBy(item.data.total, 'ts')).map(([date, val]) => {
                        let groupedByName = groupBy(val, 'u.name');
                        return { ts: date, agent: (groupedByName['beettest_agent1008'] || []).length, visitor: (groupedByName['Manu-testing'] || []).length, chatbot: (groupedByName['chatbot'] || []).length }
                    })
                )
                console.log('transformData : ', transformedData);
                setData({ data: transformedData, xaxisFormat });
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
        
        setErrorMsg(errorMsg);
    
        if(!errorMsg) {
            setStartDate(tempStartDate);
            setEndDate(tempEndDate);
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
                <Grid container justifyContent="flex-end">
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={tempStartDate}
                                onChange={setTempStartDate}
                                renderInput={(props) => <TextField {...props} sx={{ marginRight: '8px' }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={tempEndDate}
                                onChange={setTempEndDate}
                                renderInput={(props) => <TextField {...props} />}
                            />
                            <IconButton onClick={handleFilterClick}>
                                <FilterListIcon />
                            </IconButton>
                            <IconButton onClick={handleReloadClick}>
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
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.data}>
                            <Line type="monotone" dataKey="agent" stroke="#8884d8" strokeWidth={2} />
                            <Line type="monotone" dataKey="visitor" stroke="#82ca9d" strokeWidth={2} />
                            <Line type="monotone" dataKey="chatbot" stroke="#ffc658" strokeWidth={2} />
                            <CartesianGrid stroke="#FFFFFF" strokeDasharray="5 5" />
                            <XAxis dataKey="ts" stroke="#FFFFFF" tickFormatter={(tickItem) => dayjs(tickItem).format(data.xaxisFormat)} />
                            <YAxis stroke="#FFFFFF" allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                        </LineChart>
                    </ResponsiveContainer>
                    {errorMsg && (
                        <ErrorSnackbar 
                            errorMessage={errorMsg}
                            container={'dialog'}
                            anchorOrigin={{ vertical: 'top', horizontal: 'rigth' }}
                        />
                    )}
                </Box>
            </CardContent>
            <Divider />
        </Card>
    );
}; 
