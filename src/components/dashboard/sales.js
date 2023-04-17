import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, TextField, Card, CardContent, CardHeader, Divider, useTheme } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';


export const Sales = (props) => {

  const theme = useTheme();

  const [valueFrom, setValueFrom] = useState(null);
  const [valueTo, setValueTo] = useState(null);

  const data = {
    datasets: [
      {
        backgroundColor: '#FFCB42',
        borderColor: '#FFCB42',
        borderWidth: 3,
        data: [18, 5, 19, 27, 29, 19, 20],
        label: 'Incoming SMS',
      },
      {
        backgroundColor: '#85CDFD',
        borderColor: '#85CDFD',
        borderWidth: 3,
        data: [11, 20, 12, 29, 30, 25, 13],
        label: 'Outgoing SMS',
      }
    ],
    labels: ['1 Mar', '2 Mar', '3 Mar', '4 Mar', '5 Mar', '6 Mar', '7 Mar']
  };

  const options = {
    animation: true,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    xAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          fontColor: theme.palette.text.secondary,
          beginAtZero: true,
          min: 0
        },
        gridLines: {
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.palette.divider,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.palette.divider
        }
      }
    ],
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  return (
    <Card {...props}>
      <CardHeader
        action={(
          <>
           <Box display='inline-block'>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From"
                value={valueFrom}
                onChange={(newValue) => {setValueFrom(newValue)}}
                renderInput={(params) => <TextField {...params}
size='small' />}
              />
            </LocalizationProvider>
          </Box>
          <Box display='inline-block'
ml={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To"
                value={valueTo}
                onChange={(newValue) => {setValueTo(newValue)}}
                renderInput={(params) => <TextField {...params}
size='small' />}
              />
            </LocalizationProvider>
          </Box>
          </>
        )}
        title="WHATSAPP METRICS"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: 'relative'
          }}
        >
          <Line
            data={data}
            options={options}
          />
        </Box>
      </CardContent>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon fontSize="small" />}
          size="small"
        >
          Overview
        </Button>
      </Box>
    </Card>
  );
};
