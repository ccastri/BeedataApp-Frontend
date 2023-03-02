import { styled } from '@mui/material/styles';
import { Box, Container, CssBaseline, Button } from '@mui/material';
import HomeNavbar from '../components/home-navbar';

const MainLayoutRoot = styled('div')(({ theme }) => ({
  // backgroundImage: `url('/static/background1.png')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  // backgroundRepeat: 'no-repeat',
  // backgroundColor: 'rgba(255, 255, 255, 0.8)',
  minHeight: '100vh',
  '@media (max-width: 600px)': {
    backgroundSize: 'contain',
  },
}));


const MainLayout = ({ children }) => {
  const handleClick = () => {
    // Go to this link
    window.location.href = 'https://calendly.com/melissapenagos/45min?month=2023-01';
  };
  return (
    <MainLayoutRoot>
      <CssBaseline />
      <HomeNavbar />
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
          }}
        >
        </Box>
      {children}
    </MainLayoutRoot>
  );
};

export default MainLayout;

