import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MetricsTable } from './metrics-table';
import { StatsCard } from '../../../general/stats-cards';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import api from '../../../../lib/axios';


export const MetricsContent = ({ agents }) => {
    const [data, setData] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const response = await api.get('/api/v1/social/messages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startDate: startDate,
                        endDate: endDate,
                    },
                });

                if (response.data.success) {
                    const data = response.data.messages
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [startDate, endDate]);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
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
                <Grid item xs={4}>
                    <StatsCard
                        title="Total Tickets"
                        value={0}
                        type="Tickets"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatsCard
                        title="Open Tickets"
                        value={0}
                        type="Tickets"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatsCard
                        title="Closed Tickets"
                        value={0}
                        type="Tickets"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatsCard
                        title="Total Agents"
                        value={0}
                        type="Agents"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatsCard
                        title="Total Departments"
                        value={0}
                        type="Departments"
                    />
                </Grid>
                <Grid item xs={4}>
                    <StatsCard
                        title="Rooms unattended"
                        value={0}
                        type="Departments"
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ mb: 4 }}>
                            <CardHeader title="Line Chart" />
                            <CardContent sx={{
                                backgroundColor: 'neutral.900',
                                color: '#FFFFFF',
                            }}>
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={data} sx={{ background: '#FFFFFF' }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                                        <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MetricsTable />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

MetricsContent.propTypes = {
    agents: PropTypes.array.isRequired,
};