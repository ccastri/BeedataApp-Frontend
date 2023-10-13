import React from 'react';
import { FbSignupFlow } from '../fb-signup-flow';
import { PhonesTable } from './phones-table';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FacebookIcon from '@mui/icons-material/Facebook';


export const WpGeneralContent = ({ accessToken, wabas, updateRowStatus }) => {

    const columns = [
        { field: 'waba', headerName: 'Whatsapp Bussiness ID' },
        { field: 'phone', headerName: 'Phone Number' },
        { field: 'status', headerName: 'Status' },
        { field: 'actions', headerName: 'Actions' },
    ];
    return (
        <>
            <Card sx={{ mt: 3, maxHeight: '500px', overflow: 'auto' }}>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }} variant="subtitle2">
                        Permissions
                    </Typography>
                    {accessToken ? (
                        <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 3 }}>
                            To change Meta permissions granted to Beet, click on the button below.
                        </Typography>
                    ) : (
                        <>
                            <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 3 }}>
                                To use Beet's characters (chatbot), you need to grant Meta permission to Beet.
                                To do this, you need to have:
                            </Typography>
                            <List sx={{ ml: 8, mb: 3 }}>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemText
                                            primary="A Meta Business account"
                                            sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                        />
                                        <IconButton sx={{ ml: 4 }} onClick={() => window.open('https://www.facebook.com/business/help/1710077379203657?id=180505742745347')}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="At least one business application with the WhatsApp product installed"
                                        sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <ListItemText
                                            primary="A phone number configured to be used by the chatbot"
                                            sx={{ '& .MuiTypography-body1': { color: 'text.secondary', fontWeight: 'bold' } }}
                                        />
                                        <IconButton sx={{ ml: 4 }} onClick={() => window.open('https://www.facebook.com/business/help/456220311516626?id=2129163877102343&ref=search_new_0')}>
                                            <OpenInNewIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            </List>
                            <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 3 }}>
                                Once you have these requirements, you can grant permission to Beet by clicking on the button below.
                            </Typography>
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            autoFocus
                            variant="contained"
                            sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
                            endIcon={<FacebookIcon />}
                        >
                            Permissions
                        </Button>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ mt: 3, maxHeight: '500px', overflow: 'auto' }}>
                <CardContent>
                    <Typography sx={{ ml: 1, mr: 2, mb: 2, mt: 2, fontSize: '1.2rem' }} variant="subtitle2">
                        Current Granted Permissions and Phone Number Lines in Use
                    </Typography>
                    <Typography color="textSecondary" variant="body1" sx={{ ml: 1, mb: 3 }}>
                        The following table displays current granted permissions and phone number lines
                        currently being used on Beet characters (chatbots). You can disconnect a phone number
                        from a chatbot by clicking on the disconnect button action.
                    </Typography>
                    <Alert severity="info" sx={{ ml: 2, mb: 2 }}>
                        <Typography variant="body1" sx={{ ml: 1, mb: 1 }}>
                            <strong>Important:</strong> You can disconnect a phone number from a chatbot by clicking on the disconnect button action.
                        </Typography>
                    </Alert>
                    <PhonesTable columns={columns} rows={wabas} updateRowStatus={updateRowStatus}/>
                </CardContent>
            </Card>
        </>
    )
};

WpGeneralContent.propTypes = {
    accessToken: PropTypes.bool.isRequired,
    wabas: PropTypes.array.isRequired,
    updateRowStatus: PropTypes.func.isRequired,
};