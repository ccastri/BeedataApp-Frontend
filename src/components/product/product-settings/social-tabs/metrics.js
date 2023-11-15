import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MetricsTable } from './metrics-table';
import { StatsCard } from '../../../general/stats-cards';
import { ExportButton } from './social-msgs-export';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import api from '../../../../lib/axios';

function getBusiestDay(rooms) {
    if (rooms.length === 0) {
        return 0;
    }

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const counts = [0, 0, 0, 0, 0, 0, 0];

    rooms.forEach(room => {
        const date = new Date(room.ts);
        const dayOfWeek = date.getDay();
        counts[dayOfWeek]++;
    });

    const maxCount = Math.max(...counts);
    const busiestDayIndex = counts.indexOf(maxCount);
    return daysOfWeek[busiestDayIndex];
}

function getAverageRoomsPerDay(rooms) {
    const roomsByDate = {};

    rooms.forEach(room => {
        const date = new Date(room.ts).toLocaleDateString();
        if (!roomsByDate[date]) {
            roomsByDate[date] = [];
        }
        roomsByDate[date].push(room);
    });


    const dates = Object.keys(roomsByDate);
    const totalRooms = dates.reduce((prev, date) => prev + roomsByDate[date].length, 0);
    const averageRoomsPerDay = dates.length > 0 ? totalRooms / dates.length : 0;

    return parseFloat(averageRoomsPerDay.toFixed(2));
}

function getBusiestHour(messages) {
    if (messages.length === 0) {
        return 0;
    }

    const hours = new Array(24).fill(0);

    messages.forEach((message) => {
        message.data.total.forEach((msg) => {
            const date = new Date(msg.ts);
            const hour = date.getHours();
            hours[hour]++;
        });
    });

    const busiestHourIndex = hours.indexOf(Math.max(...hours));
    const busiestHour = busiestHourIndex < 12 ? busiestHourIndex : busiestHourIndex - 12;
    const amPm = busiestHourIndex < 12 ? 'a.m.' : 'p.m.';
    const formattedBusiestHour = `${busiestHour === 0 ? 12 : busiestHour}:00 ${amPm}`;

    return formattedBusiestHour;
}


export const MetricsContent = ({ agents }) => {
    const [state, setState] = useState({
        messages: [],
        rooms: [],
        loading: true,
    });
    const data = [];

    const { messages, rooms } = state;

    const [startDate, setStartDate] = useState(() => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return oneMonthAgo;
    });
    const [endDate, setEndDate] = useState(new Date());
    const theme = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const messagesResponse = await api.get('/api/v1/social/messages', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        isMetrics: true,
                        startFilter: startDate,
                        endFilter: endDate,
                    },
                });

                const roomsResponse = await api.get('/api/v1/social/rooms', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        startFilter: startDate,
                        endFilter: endDate,
                    },
                });

                if (messagesResponse.data.success && roomsResponse.data.success) {
                    setState({
                        messages: messagesResponse.data.messages,
                        rooms: roomsResponse.data.rooms,
                        loading: false,
                    });
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [startDate, endDate]);

    console.log('messages', messages);

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

    const servedByRooms = rooms.filter(room => room.servedBy);

    const statsCards = [
        {
            title: 'Total Chat Rooms',
            value: servedByRooms.length,
        },
        {
            title: 'Open Chat Rooms',
            value: servedByRooms.filter(room => room.open === true).length,
        },
        {
            title: 'Total Messages',
            value: messages.reduce((prev, curr) => prev + curr.data.total.length, 0),
        },
        {
            title: 'Busiest Day',
            value: getBusiestDay(servedByRooms),
        },
        {
            title: 'Average Chat Rooms Per Day',
            value: getAverageRoomsPerDay(servedByRooms),
        },
        {
            title: 'Busiest Hour',
            value: getBusiestHour(messages),
        },
    ];

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = startDate && endDate ? Math.round(Math.abs((startDate - endDate) / oneDay)) : 0;

    if (diffDays > 1) {
        const roomsByDate = {};

        servedByRooms.forEach(room => {
            const date = new Date(room.ts).toLocaleDateString();
            if (!roomsByDate[date]) {
                roomsByDate[date] = [];
            }
            roomsByDate[date].push(room);
        });

        const dates = Object.keys(roomsByDate);
        dates.sort((a, b) => new Date(a) - new Date(b));

        dates.forEach(date => {
            const roomsOnDate = roomsByDate[date];
            const totalRoomsOnDate = roomsOnDate.length;
            const formattedDate = date.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3'); // format date as MM/DD
            data.push({ name: formattedDate, rooms: totalRoomsOnDate });
        });
    } else {
        const hours = new Array(24).fill(0);

        servedByRooms.forEach(room => {
            const date = new Date(room.ts);
            const hour = date.getHours();
            hours[hour]++;
        });

        for (let i = 0; i < 24; i++) {
            const hour = i < 12 ? i : i - 12;
            const amPm = i < 12 ? 'AM' : 'PM';
            const formattedHour = `${hour === 0 ? 12 : hour}${amPm}-${hour === 11 ? 12 : hour + 1}${amPm}`;
            data.push({ name: formattedHour, rooms: hours[i] });
        }
    }

    const agentData = agents.map((agent) => {
        const roomsServedByAgent = servedByRooms.filter((room) => room.servedBy._id === agent.agent_id);
        const percentageOfRooms = ((roomsServedByAgent.length / servedByRooms.length) * 100).toFixed(2);
        return {
            agent_id: agent.agent_id,
            agent_name: agent.name,
            percentage_of_rooms: percentageOfRooms,
        };
    });

    if (state.loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress
                    data-testid='loading'
                />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}
            data-testid='metrics'
            id='metrics-content'>
            <Grid container
                spacing={2}>
                <Grid container
                    justifyContent="flex-end"
                    sx={{ ml: 2 }}>
                    <Card sx={{ width: '100%' }}>
                        <CardContent>
                            <ThemeProvider theme={theme}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid container justifyContent="space-between">
                                        <Grid item>
                                            <ExportButton messages={messages} />
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={2}>
                                                <Grid item>
                                                    <DatePicker
                                                        label="Start Date"
                                                        value={startDate}
                                                        onChange={handleStartDateChange}
                                                        renderInput={(props) => <TextField {...props} sx={{ mr: 3 }} />}
                                                    />
                                                </Grid>
                                                <Grid item>
                                                    <DatePicker
                                                        label="End Date"
                                                        value={endDate}
                                                        onChange={handleEndDateChange}
                                                        renderInput={(props) => <TextField {...props} />}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </LocalizationProvider>
                            </ThemeProvider>
                        </CardContent>
                    </Card>
                </Grid>
                {statsCards.map((card, index) => (
                    <Grid item
                        xs={4}
                        key={index}>
                        <StatsCard
                            title={card.title}
                            value={card.value}
                        />
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 4 }} >
                <Grid container
                    spacing={2}>
                    <Grid item
                        xs={12}
                        md={6}
                        data-testid='rooms-chart'
                        id='chart-container'>
                        <Card sx={{ mb: 4 }}>
                            <CardHeader title="Total Chat Rooms" />
                            <CardContent sx={{
                                backgroundColor: 'neutral.900',
                                color: '#FFFFFF',
                            }}>
                                <ResponsiveContainer width="100%"
                                    height={400}>
                                    <LineChart data={data}
                                        sx={{ background: '#FFFFFF' }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis tickFormatter={(tick) => parseInt(tick)} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone"
                                            dataKey="rooms"
                                            stroke="#8884d8"
                                            activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item
                        xs={12}
                        md={6}
                        data-testid='agents-rooms-table'
                        id='table-container'>
                        <MetricsTable data={agentData} />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

MetricsContent.propTypes = {
    agents: PropTypes.array.isRequired,
};