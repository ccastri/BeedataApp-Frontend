import { AppBar, Button, Box, Toolbar, Typography, Grid } from '@mui/material';
import NextLink from 'next/link';
import { css } from '@emotion/react';

const responsiveButtonStyle = css`
  width: 90px;
  height: 40px;
  @media (max-width: 600px) {
    width: 70px;
    height: 40px;
  }
`;

const HomeNavbar = () => (
  <AppBar
    position="static"
    sx={{
      boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
      background: 'linear-gradient(to bottom, #2D3748, #1E272C)',
      borderRadius: '10px',
      border: '1px solid #1E272C'
    }}
  >
    <Toolbar>
      <Typography variant="h6">
        <img 
            src='/static/small-logo.png' 
            alt="Beedata logo" 
            width="auto"
            height="auto" 
        />
      </Typography>
      <Box ml="auto">
        <Grid container spacing={2}>
            <Grid item>
                <NextLink href="/login">
                    <Button 
                        variant="contained"
                        color="primary"
                        sx={responsiveButtonStyle}
                        >
                        Login
                    </Button> 
                </NextLink>
            </Grid>
            <Grid item>
                <NextLink href="/register">
                    <Button sx={responsiveButtonStyle} variant="contained" color="primary">Register</Button>
                </NextLink>
            </Grid>
        </Grid>
      </Box>
    </Toolbar>
  </AppBar>
);

export default HomeNavbar;
