import React, { useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { BotInfo } from './bot-info';
import { BotActivation } from './bot-activation';

const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.4)',
};

export const BotCard = ({ bot, ...rest }) => {

    return (
        <Card
            sx={cardStyle}
        >
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pb: 3,
                    }}
                >
                    <Avatar
                        alt="Bot"
                        src={bot.image}
                        sx={{ height: 200, width: 200 }}
                    />
                </Box>
                <Box
                    sx={{
                        textAlign: 'center',
                    }}
                >
                    <Typography
                        align="center"
                        color="textPrimary"
                        gutterBottom
                        variant="h5"
                    >
                        {bot.name}
                    </Typography>
                    <Typography
                        align="center"
                        color="textSecondary"
                        variant="subtitle1"
                    >
                        {bot.role}
                    </Typography>
                </Box>
            </CardContent>
            <Divider />
            <CardActions>
                <BotInfo
                    name={bot.name}
                    image={bot.image}
                    role={bot.role}
                />
                <BotActivation/>
            </CardActions>
        </Card>
    );
};

BotCard.propTypes = {
    bot: PropTypes.object.isRequired,
};