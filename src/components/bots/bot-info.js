import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import api from '../../lib/axios';


const StyledCard = styled(Card)(({ theme }) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return {
        maxWidth: isSmallScreen ? '90vw' : '60vw',
        margin: 'auto',
        borderRadius: 12,
        padding: 12,
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
        display: 'flex',
        alignItems: 'center',
    };
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return {
        borderRadius: 10,
        width: isSmallScreen ? 150 : 230,
        height: isSmallScreen ? 150 : 230,
    };
});

export const BotInfo = (props) => {
    const { name, image, role } = props;
    const [open, setOpen] = useState(false);

    const isSmallScreen = useMediaQuery('(max-width:600px)');
    const isMediumScreen = useMediaQuery('(max-width:960px)');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const onSubmit = async (values) => {
        try {
            console.log(values);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Button
                onClick={handleClickOpen}
                variant="contained"
                fullWidth
                color="primary"
                sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
            >
                Info
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: isSmallScreen ? '90vw' : isMediumScreen ? '60vw' : '40vw',
                        height: isSmallScreen ? '60vh' : isMediumScreen ? '65vh' : '50vh',
                        overflow: 'hidden',
                    },

                }}
            >
                <DialogContent>
                    <StyledCard>
                        <Grid container
                            spacing={2}>
                            <Grid item
                                xs={5}>
                                <StyledCardMedia image={image} />
                            </Grid>
                            <Grid item
                                xs={7}>
                                <CardContent>
                                    <Typography
                                        align="center"
                                        gutterBottom
                                        variant="h4"
                                        component="div"
                                    >
                                        {name}
                                    </Typography>
                                    <Typography
                                        align="center"
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                    >
                                        {role}
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                    </StyledCard>
                </DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <DialogActions>
                    </DialogActions>
                </Box>
            </Dialog>
        </>
    );
};
