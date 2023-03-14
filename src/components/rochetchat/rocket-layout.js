import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RocketNavbar } from './rocket-navbar';
import { AuthGuard } from '../auth-guard';

const RocketchatLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

export const RocketchatLayout = (props) => {
  const { children } = props;

  return (
    <AuthGuard>
      <RocketchatLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </RocketchatLayoutRoot>
      <RocketNavbar />
    </AuthGuard>
  );
};
