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
import jwt from 'jsonwebtoken';

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
    const accessToken =sessionStorage.getItem('accessToken'); // Optionally store it in session storage
    // const shop = sessionStorage.getItem('shop url'); // Optionally store it in session storage
    const appbridge= sessionStorage.getItem('app-bridge-config'); // Optionally store it in session storage
    // console.log(appbridge)
    
    console.log(accessToken)
    if (appbridge) {
        try {
            const parsedAppbridge = JSON.parse(appbridge);
            parsedAppbridge.accessToken = accessToken;
            return {
                // token,
                shop: parsedAppbridge.shop || '',
                host: decodeBase64(parsedAppbridge.host || ''),
                apiKey: parsedAppbridge.apiKey || '',
                accessToken: parsedAppbridge.accessToken
            };
        } catch (error) {
            console.error('Failed to parse appbridge JSON:', error);
        }
    }
    
    return { accessToken:'', shop: '', host: '', apiKey: '' };
}
const decodeBase64 = (base64String) => {
    try {
        return atob(base64String);
    } catch (error) {
        console.error('Failed to decode Base64:', error);
        return '';
    }
};

// const handleSingleSelectChange = (value) => {
//     setSelectedOption(value);
// };

const handleStepSelectionChange = (stepIndex, value) => {
    setStepSelections(prev => ({ ...prev, [stepIndex]: value }));
};

const decodeJwt = (token) => {
    try {
        const decoded = jwt.decode(token);
        if (decoded && decoded.company_id) {
            console.log(decoded)
            return decoded.company_id;
        }
        return null;
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
};
const Page = () => {
    
    
    
    const [credentials, setCredentials] = useState({ accessToken: '', shop: '', host: '', apiKey: '' });
    // const [appbridgeDetails, setAppbridgeDetails] = useState({});
    // const [decodedHost, setDecodedHost] = useState('');
    // const [stepSelections, setStepSelections] = useState({}); 
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [companyId, setCompanyId] = useState(null);
    
    const handleButtonClick = () => {
        setButtonDisabled(prev => !prev);
        console.log(buttonDisabled)
    };
    useEffect(() => {
        const fetchTokenAndDecode = () => {
            const authHeader = document.cookie // o usa `sessionStorage` si almacenas ahí el token
                .split('; ')
                .find(row => row.startsWith('Authorization='))
                ?.split('=')[1];

            if (authHeader) {
                const company_id = decodeJwt(authHeader);
                setCompanyId(company_id);
            }
        };

        fetchTokenAndDecode();
    }, []);

    useEffect(() => {
        const { accessToken, token, shop, host, apiKey } = fetchShopifyCredentials();
        setCredentials({ accessToken, shop, host, apiKey });
        console.log(accessToken)
        console.log(credentials)
        // console.log(token)
        console.log(shop)
        console.log(host)
        console.log(apiKey)
        

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
                <Button
      variant="contained"
      color="primary"
      startIcon={<AddLinkIcon/>}
      onClick={handleButtonClick}
    >
      Link my store!
    </Button>
            </CardContent>
        </StyledCard>
        {!buttonDisabled && (
            <CenteredContainer >
                <CardTitle sx={{ mt: 8, textAlign: "center", width: '50%' }}variant="h4" color="primary">
                    Please make sure the following data matches with your shopify store
                </CardTitle>
        <Box sx={{ mt: 4, mb: 4, textAlign: "center", width: '50%' }}>
        <div style={{ marginTop: '60px', marginBottom:"60px" }}>
                    <TextField
                        label="accessToken"
                        value={credentials.accessToken || ""}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Shopify Host"
                        value={credentials.host || ""}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Api Key"
                        value={credentials.apiKey || ""}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Shop URL"
                        value={credentials.shop || ""}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                </div>

        <StyledCard>
            
        <VerticalLinearStepper
         onSelectionChange={handleStepSelectionChange}
         storeData={credentials}
        />

        </StyledCard>

        
                    </Box>
        </CenteredContainer>
             )}
    </>
);
}
Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;