import Head from 'next/head';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DashboardLayout } from '../components/general/dashboard-layout';
import { styled } from '@mui/material/styles';


const StyledCard = styled(Card)(({ theme }) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return {
      maxWidth: isSmallScreen ? '90vw' : '40vw',
      margin: 'auto',
      borderRadius: 12,
      padding: 12,
      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)',
    };
  });
  
  const ResponsiveCardMedia = styled(CardMedia)(({ theme }) => {
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    return {
      height: isSmallScreen ? 150 : 200,
      width: isSmallScreen ? 150 : 200,
      margin: 'auto',
    };
  });

const Page = () => (
    <>
        <Head>
            <title>Beet | Coming Soon</title>
        </Head>
        <StyledCard>
            <ResponsiveCardMedia
                component="img"
                image="/static/images/settings.png"
                alt="Coming Soon"
            />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    color="primary"
                >
                    This page will be available soon
                </Typography>
                <Typography variant="subtitle1"
color="text.secondary">
                    We are working hard to bring you the best experience possible. Please check back soon.
                </Typography>
            </CardContent>
        </StyledCard>
    </>
);

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;