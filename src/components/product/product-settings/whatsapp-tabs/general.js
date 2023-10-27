import React from 'react';
import { FbSignupFlow } from '../fb-signup-flow';
import { PermissionChange } from './permission-change';
import { PhonesTable } from './phones-table';
import { ProductActivation } from './product-activation';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';


export const WpGeneralContent = ({ accessToken, wabas, deleteRow, isConsumption, credit, updateCompanyConsumption, purchaseConsumptionProduct, productId }) => {

    return (
        <>
            {productId === 1 && (
                <Card sx={{ mt: 3, maxHeight: '600px', overflow: 'auto' }}>
                    <CardContent>
                        <Typography
                            sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
                            variant="subtitle2"
                            data-testid='product-activation'
                        >
                            Credit Consumption Activation
                        </Typography>
                        <Typography color="textSecondary"
                            variant="body1" sx={{ ml: 1, mb: 3 }}>
                            To activate the credit consumption on Beet, click on the button below.
                        </Typography>
                        <Alert severity="info"
                            sx={{ ml: 2, mb: 2 }}>
                            <Typography variant="body1"
                                sx={{ ml: 1, mb: 1 }}>
                                <strong>Important:</strong> You need to have credit to be availble to activate the message consumption.
                            </Typography>
                        </Alert>
                        <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <ProductActivation isConsumption={isConsumption} credit={credit} updateCompanyConsumption={updateCompanyConsumption} purchaseConsumptionProduct={purchaseConsumptionProduct} />
                        </CardActions>
                    </CardContent>
                </Card>
            )}
            <Card sx={{ mt: 3, maxHeight: '600px', overflow: 'auto' }}>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
                        variant="subtitle2"
                        data-testid='permissions-title' >
                        Permissions
                    </Typography>
                    {accessToken ? (
                        <>
                            <Typography color="textSecondary"
                                variant="body1"
                                sx={{ ml: 1, mb: 3 }}>
                                To change Meta permissions granted to Beet, click on the button below.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}
                                data-testid='permissions-change'>
                                <PermissionChange rows={wabas}
                                    deleteRow={deleteRow} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography color="textSecondary"
                                variant="body1"
                                sx={{ ml: 1, mb: 3 }}>
                                To use Beet&apos;s characters (chatbot), you need to grant Meta permission to Beet.
                                To do this, you need to have:
                            </Typography>
                            <List sx={{ ml: 8, mb: 3 }}>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <RadioButtonCheckedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="A Meta Business account and ADMINISTRATOR access"
                                            sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                        />
                                        <IconButton sx={{ ml: 4 }}
                                            onClick={() => window.open('https://business.facebook.com/')}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <RadioButtonCheckedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="A phone number configured to be used by the chatbot"
                                            sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                        />
                                        <IconButton sx={{ ml: 4 }}
                                            onClick={() => window.open('https://www.facebook.com/business/help/456220311516626?id=2129163877102343&ref=search_new_0')}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemIcon>
                                            <RadioButtonCheckedIcon />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="A credit card configured in META."
                                            sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                        />
                                        <IconButton sx={{ ml: 4 }}
                                            onClick={() => window.open('https://business.facebook.com/billing_hub/payment_methods?business_id=1915364938801277&placement=standalone')}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            </List>
                            <Typography color="textSecondary"
                                variant="body1"
                                sx={{ ml: 1, mb: 3 }}>
                                Once you have these requirements, you can grant permission to Beet by clicking on the button below.
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <FbSignupFlow title={'Permissions'} />
                            </Box>
                        </>
                    )}
                </CardContent>
            </Card>
            <Card sx={{ mt: 3, maxHeight: '700px', overflow: 'auto' }}
                data-testid='phones-data'>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }}
                        variant="subtitle2">
                        Current Granted Permissions and Phone Number Lines in Use
                    </Typography>
                    <Typography color="textSecondary"
                        variant="body1"
                        sx={{ ml: 1, mb: 3 }}>
                        The following table displays current granted permissions and phone number lines
                        currently being used on Beet characters (chatbots). You can disconnect a phone number
                        from a chatbot by clicking on the disconnect button action.
                    </Typography>
                    <PhonesTable rows={wabas} />
                </CardContent>
            </Card>
        </>
    )
};

WpGeneralContent.propTypes = {
    accessToken: PropTypes.bool.isRequired,
    wabas: PropTypes.array.isRequired
};