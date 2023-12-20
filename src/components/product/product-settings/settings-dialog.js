import React, { useState, forwardRef } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import Slide from '@mui/material/Slide';
import SuccessSnackbar from '../../general/success-msg';
import ErrorSnackbar from '../../general/error-msg';

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up"
ref={ref}
{...props} />;
});

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-container': {
        maxWidth: '86%',
        marginLeft: 'auto',
        marginRight: '0',
        [theme.breakpoints.down('md')]: {
            maxWidth: '100%',
            margin: '0',
            height: '100%',
            '& .MuiPaper-root': {
                height: '100%',
                borderRadius: '0',
            },
        },
    },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    marginBottom: 0,
    [theme.breakpoints.down('md')]: {
        marginBottom: 0,
    },
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#111827',
    color: '#FFFFFF',
    '& .MuiTypography-root': {
        fontSize: '1.6rem',
    },
    [theme.breakpoints.down('md')]: {
        '& .MuiTypography-root': {
            fontSize: '1.2rem',
        },
    },
    maxHeight: '64px',
}));

export const SettingsDialog = ({ tabs, response, error, clearMessages }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(0);
    const theme = useTheme();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        clearMessages();
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <IconButton
                onClick={handleClickOpen}
                sx={{ ml: 4, mr: 4, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)', color: '#111827', borderColor: '#111827' }}
                data-testid="settings-button"
            >
                <SettingsIcon />
            </IconButton>
            <StyledDialog
                fullScreen
                open={open}
                onClose={handleClose}
                scroll='paper'
                TransitionComponent={Transition}
            >
                <StyledAppBar sx={{ position: 'relative' }}>
                    <StyledToolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        {tabs ? (
                            <Tabs value={value}
onChange={handleChange}
textColor='secondary'
indicatorColor='secondary'>
                                {tabs.map((tab, index) => (
                                    <Tab key={index}
label={tab.label}
sx={{ color: '#FFFFFF' }} />
                                ))}
                            </Tabs>
                        ) : (
                            <Typography sx={{ ml: 2, flex: 1 }}
variant="h6"
component="div">
                                Settings
                            </Typography>
                        )}
                    </StyledToolbar>
                </StyledAppBar>
                <DialogContent sx={{ backgroundColor: theme.palette.background.default }}
dividers>
                    {tabs && tabs[value].content}
                </DialogContent>
                {response && (
                    <SuccessSnackbar responseMessage={response}
                        container={'dialog'} />
                )}
                {error && (
                    <ErrorSnackbar errorMessage={error}
                        container={'dialog'} />
                )}
            </StyledDialog>
        </>
    );
}