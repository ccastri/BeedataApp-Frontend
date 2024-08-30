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
import ShopifyCredentials from '../components/integrations/FetchCredentials';
// import jwt from 'jsonwebtoken';
import { getUserCompanyId, getUserRole } from '../utils/get-user-data';
import Cookies from 'js-cookie';
import api from '../lib/axios';
import { fetchShopifyCredentialsFromBackend } from '../utils/get-shopify-credentials';
const companyId = getUserCompanyId()


const jwt = Cookies.get('jwt');
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



const handleStepSelectionChange = (stepIndex, value) => {
    setStepSelections(prev => ({ ...prev, [stepIndex]: value }));
};




const Page = () => {

    const [credentials, setCredentials] = useState({ accessToken: '', host: '' , pair1: '', pair2: '', });
    const [buttonDisabled, setButtonDisabled] = useState(true);

    const handleButtonClick = () => {
        setButtonDisabled(prev => !prev);
        console.log(buttonDisabled)
    };
    console.log(credentials)



  useEffect(() => {
      const getCredentials = async () => {
        const resp = await fetchShopifyCredentialsFromBackend(companyId, jwt);
        setCredentials(resp); // Set the fetched credentials as the state
        setButtonDisabled(false); // Enable the button if needed
      };

      getCredentials();
    }, [companyId, jwt]);



  return (

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
                <Button
      variant="contained"
      color="primary"
      startIcon={<AddLinkIcon/>}
      onClick={handleButtonClick}
    >
      Start Journey
    </Button>
            </CardContent>
        </StyledCard>
        {!buttonDisabled && (
          <>
     <Box sx={{ my: 4,  textAlign: "center", width: '50%' }}>

                </Box>
         <Box sx={{ my: 4 }}>

        <StyledCard
        sx={{ width: '100%' }}>
            <VerticalLinearStepper
                onSelectionChange={handleStepSelectionChange}
                storeData={credentials}
                onCredentialsFetched={fetchShopifyCredentialsFromBackend}
                />
        </StyledCard>
        </Box>
        </>
)}
    </>
);
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
