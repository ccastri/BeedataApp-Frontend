import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RocketNavbar } from './rocket-navbar';
import { AuthGuard } from '../general/auth-guard';

const RocketchatLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 0
  }
}));

export const RocketchatLayout = (props) => {
  const { children } = props;

  return (
    <AuthGuard>
      <RocketNavbar />
      <RocketchatLayoutRoot>
        <Box
          sx={{
            position: 'relative',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            marginTop: '2%', // set the top margin to the navbar height
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              width: '100%',
              overflow: 'hidden', // hide the overflow of the iframe
            }}
          >
          {children}
          </Box>
        </Box>
      </RocketchatLayoutRoot>
    </AuthGuard>
  );
};
