import { Box } from '@mui/material';

export const CoverRectangle = () => {
    return (
        <Box
        sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            height: '10%',
            width: '20%',
            backgroundColor: '#30343c',
            zIndex: 9999,
            '@media screen and (minWidth: 576px)': {
                height: '15%',
                width: '35%',
            },
            '@media screen and (maxWidth: 550px)': {
                display: 'none',
            },
        }}
        />
    );
};