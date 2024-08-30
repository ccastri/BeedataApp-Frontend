import Head from 'next/head';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DashboardLayout } from '../components/general/dashboard-layout';
import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, Paper, Tab, Tabs, TextField } from '@mui/material';
// import { addlink } from '../icons/add-link';
import SignpostIcon from '@mui/icons-material/Signpost';
import { useEffect, useRef, useState } from 'react';
import VerticalLinearStepper from '../components/shopify/data-onboarding';
import SingleSelectForm from '../components/shopify/multichoice-form';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ChatwootFileSystem from '../components/integrations/MessageExplorer';
import InteractiveList from '../components/integrations/FolderExplorer';

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

const CenteredContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    minHeight: '100vh',
}));
const CardTitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));


const decodeBase64 = (base64String) => {
    try {
        return atob(base64String);
    } catch (error) {
        console.error('Failed to decode Base64:', error);
        return '';
    }
};

const Page = () => {

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [companyId, setCompanyId] = useState(null);
    const [value, setValue] = useState(0); // State for Tabs
    const router = useRouter();
    const tabRef = useRef(null);



    const handleButtonClick = () => {
      // setButtonDisabled(prev => !prev);
      console.log(buttonDisabled);
      router.push('/onboarding');
    };





    const handleChange = (event, newValue) => {
      setValue(newValue);
  };


  // const handleCustomizeClick = () => {
  //   router.push("/home").then(() => {
  //     if (tabRef.current) {
  //       tabRef.current.scrollIntoView({ behavior: 'smooth' });
  //     }
  //   });
  // };


  useEffect(() => {
    const { scrollTo } = router.query;

    if (scrollTo === 'targetElement' && tabRef.current) {
      tabRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [router.query]);
    return(

    <>
        <Head>
            <title>Beet | Shopify</title>
        </Head>
        <StyledCard>
            <ResponsiveCardMedia
                component="img"
                image="/static/beet_nb.svg"
                alt="Coming Soon"
            />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    color="primary"
                >
                    {`We're working for the success of your business and your clients satisfaction`}

                </Typography>
                <Typography
                variant="subtitle1"
color="text.secondary">
                    Click here to allow us guide you through this amazing journey!
                </Typography>
                <Button
      variant="contained"
      color="primary"
      startIcon={<SignpostIcon/>}
      onClick={handleButtonClick}
    >
      Go to onboarding
    </Button>
            </CardContent>
        </StyledCard>

            <CenteredContainer >
                <CardTitle sx={{ mt: 8, textAlign: "center", width: '50%' }}variant="h4" color="primary">
                    Here you can define custom messages, campaings, safe replys and soon... <br/> ¡Start receiving suggestions!
                    <br/>
                    <br/>
                    ...based on trends that will help you increase incoming in your business
                </CardTitle>

        </CenteredContainer>

        <Box
        ref={tabRef}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                minHeight: '100vh',  // Full viewport height
                p: 2,  // Optional padding
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 600,  // Optional: set a max width
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="icon position tabs example"
                    centered  // Center tabs horizontally
                >
                                   <Tab icon={<StorefrontIcon />} label="Pre-venta" />
                    <Tab icon={<StorefrontIcon />} iconPosition="start" label="Venta" />
                    <Tab icon={<StorefrontIcon />} iconPosition="end" label="Logistica" />
                    <Tab icon={<StorefrontIcon />} iconPosition="bottom" label="Post-venta" />
                </Tabs>
            </Box>
            <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
                {value === 0 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Pre-venta Canvas
                        </Typography>
                        <InteractiveList/>
                        <ChatwootFileSystem/>
                        <canvas id="pre-venta-canvas">canvas1</canvas>
                    </>
                )}
                {value === 1 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Venta Canvas
                        </Typography>
                        <canvas id="venta-canvas"></canvas>
                    </>
                )}
                {value === 2 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Logistica Canvas
                        </Typography>
                        <InteractiveList/>
                        <canvas id="logistica-canvas"></canvas>
                    </>
                )}
                {value === 3 && (
                    <>
                        <Typography variant="h6" gutterBottom>
                            Post-venta Canvas
                        </Typography>
                        <InteractiveList/>
                        <canvas id="post-venta-canvas"></canvas>
                    </>
                )}
            </Box>
            <Box>

            </Box>
        </Box>

    </>
);
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
