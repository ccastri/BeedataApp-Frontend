import Head from 'next/head';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DashboardLayout } from '../components/general/dashboard-layout';
import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
// import { addlink } from '../icons/add-link';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { useEffect, useState } from 'react';
import VerticalLinearStepper from '../components/shopify/data-onboarding';
import SingleSelectForm from '../components/shopify/multichoice-form';


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

const CardSubtitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));
const fetchShopifyCredentials = () => {
    const token =sessionStorage.getItem('accessToken'); // Optionally store it in session storage
    const shop = sessionStorage.getItem('shop url'); // Optionally store it in session storage
    const appbridge= sessionStorage.getItem('app-store-bridge'); // Optionally store it in session storage
    return {shop, token, appbridge}
}

const decodeBase64 = (base64String) => {
    try {
        return atob(base64String);
    } catch (error) {
        console.error('Failed to decode Base64:', error);
        return '';
    }
};


//   // Default selected option
//   const defaultValue = 'ecommerce';
// const disabledOptions = defaultValue === 'ecommerce' ? ['custom', "service provider and lead attention"] : [];

const handleSingleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleStepSelectionChange = (stepIndex, value) => {
    setStepSelections(prev => ({ ...prev, [stepIndex]: value }));
  };
const Page = () => {


    
    const [credentials, setCredentials] = useState({ shop: '', token: ''});
    const [appbridgeDetails, setAppbridgeDetails] = useState({});
    const [decodedHost, setDecodedHost] = useState('');
    // const [selectedOption, setSelectedOption] = useState(defaultValue);
  const [stepSelections, setStepSelections] = useState({}); // Track selected options for steps
    useEffect(() => {
      // Fetch credentials from session storage only in the client
      const { shop, token, appbridge } = fetchShopifyCredentials();
      setCredentials({ shop, token });
      console.log(token, appbridge); // Output for debugging
      if (appbridge) {
        try {
            const parsedAppbridge = JSON.parse(appbridge);
            setAppbridgeDetails(parsedAppbridge);
            if (parsedAppbridge.host) {
                const decodedHostValue = decodeBase64(parsedAppbridge.host);
                setDecodedHost(decodedHostValue);
            }
        } catch (error) {
            console.error('Failed to parse appbridge JSON:', error);
        }
    }
    }, []);
    return(
    
    <>
        <Head>
            <title>Beet | Shopify</title>
        </Head>
        <StyledCard>
            <ResponsiveCardMedia
                component="img"
                image="/static/images/descarga.png"
                alt="Coming Soon"
            />
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography
                    gutterBottom
                    variant="h4"
                    component="div"
                    color="primary"
                >
                    Link your store here!
                    
                </Typography>
                <Typography variant="subtitle1"
color="text.secondary">
                    Click here and complete the steps bellow to bring enhanced purchase experience to your clients
                </Typography>
                <IconButton color="primary">
        <AddLinkIcon />
      </IconButton>
            </CardContent>
        </StyledCard>
            <CenteredContainer >
                <CardTitle sx={{ mt: 8, textAlign: "center", width: '50%' }}variant="h4" color="primary">
                    Please make sure the following data matches with your shopify store
                </CardTitle>
        <Box sx={{ mt: 4, mb: 4, textAlign: "center", width: '50%' }}>
        <div style={{ marginTop: '60px', marginBottom:"60px" }}>
                    <TextField
                        label="accessToken"
                        value={credentials.token}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Shop URL"
                        value={credentials.shop}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </div>

                <Paper elevation={3} sx={{ p: 3, width: '100%', marginBottom:"60px" }}>
                    <Typography variant="h6">App Bridge Details</Typography>
                    <ul>
                        {Object.entries(appbridgeDetails).map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong> {key === 'host' ? decodedHost : value}
                            </li>
                        ))}
                    </ul>
                </Paper>
        <StyledCard>
            
        <VerticalLinearStepper
         onSelectionChange={handleStepSelectionChange}
        />

        </StyledCard>

        
                    </Box>
        </CenteredContainer>
    </>
);
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;