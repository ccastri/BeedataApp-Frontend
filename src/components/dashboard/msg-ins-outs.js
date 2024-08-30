import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { CompanyContext } from '../../contexts/company';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Button, TextField, Card, CardContent, Divider, Grid, Typography } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorSnackbar from '../general/error-msg';
import dayjs from 'dayjs';
import api from '../../lib/axios';


/**
 *
 * MsgInsOuts component displays the number of messages sent by agents, visitors and chatbot.
 *
 * Dependencies: useState, useEffect, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
 *               ResponsiveContainer, Box, TextField, Card, CardContent, CardHeader, Divider, Grid,
 *               createTheme, ThemeProvider, LocalizationProvider, AdapterDayjs, DatePicker,
 *               ReplayIcon, ErrorSnackbar, dayjs, api
 * Usage: Used to display the number of messages sent by agents, visitors and chatbot in a given time period.
 *
 */
export const MsgInsOuts = () => {
    const [errorMsg, setErrorMsg] = useState(null);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [applyFilter, setApplyFilter] = useState(false);
    const [startDate, setStartDate] = useState(() => {
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 5);
        return tenDaysAgo;
    });
    const [endDate, setEndDate] = useState(new Date());
    const theme = useTheme();

    const { token } = useContext(AuthContext);
    const { companyId } = useContext(CompanyContext);

    useEffect(() => {
        setLoading(true);
    }, [companyId]);

    useEffect(() => {
        const fetchMsgCount = async () => {
            if (!startDate || !endDate) {
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            const errorMsg = checkDateValidity(start, end);
            if (errorMsg) {
                setErrorMsg(errorMsg);
                return;
            }

            const response = await api.get(`/backend/api/v1/${companyId}/social/messages`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { startFilter: startDate, endFilter: endDate }
            });

            if (response.data.success) {
                if (response.data.messages.length > 0) {
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
                    setLoading(false);
                    setApplyFilter(false);
                } else {
                    setData({ data: [], xaxisFormat: 'DD-MMM' });
                    setLoading(false);
                    setApplyFilter(false);
                };

            } else {
                setErrorMsg(response.data.message);
            }
        };
        fetchMsgCount();
// Docker required me to add startDate and endDate 08-22-2024
    }, [applyFilter, companyId, token, startDate, endDate]);

    const checkDateValidity = (start, end) => {
        if (end <= start) return "End date must be greater than Start date";

        let fourMonthsLater = new Date(start.setMonth(start.getMonth() + 4));
        if (end > fourMonthsLater) return "Data view allowed only up to 4 months";

        return null;
    }

    const handleApply = () => {
        setApplyFilter(true);
        setLoading(true);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    return (
        <Card>
            <Box
                display="flex"
                alignItems="center"
                sx={{
                    padding: '16px',
                    justifyContent: 'space-between',
                    mt: 2,
                    mb: 2
                }}
            >
                <Grid container
                    justifyContent="flex-end">
                    <ThemeProvider theme={theme}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={handleStartDateChange}
                                renderInput={(props) => <TextField {...props}
                                    sx={{ marginRight: '8px' }} />}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={handleEndDateChange}
                                renderInput={(props) => <TextField {...props} />}
                            />
                        </LocalizationProvider>
                    </ThemeProvider>
                </Grid>
                <Button
                    autoFocus
                    variant="contained"
                    sx={{ ml: 2, mr: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                    onClick={handleApply}
                >
                    Apply
                </Button>
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
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    {loading ? (
                        <CircularProgress data-testid='loading' />
                    ) : data.data.length > 0 ? (
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
                    ) : (
                        <Typography variant="h6"
                            align="center"><br />No data to display</Typography>
                    )}
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
