import { useState } from 'react';
import { Button, Container, Box, Typography, Paper, TextField } from '@mui/material';
import { getUserCompanyId } from '../../utils/get-user-data';

const ShopifyCredentials = ({ onCredentialsFetched }) => {
  const [credentials, setCredentials] = useState(null);
  const [isFetched, setIsFetched] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleFetchCredentials = async () => {
    if (!isFetched) {
      setButtonDisabled(true); // Disable the button while fetching
      const companyId = getUserCompanyId(); // Ensure to get the companyId dynamically or pass it as a prop
      const fetchedCredentials = await onCredentialsFetched(companyId);
      setCredentials(fetchedCredentials);
      setIsFetched(true);
      setButtonDisabled(false); // Re-enable the button after fetching
    }
    setShowCredentials(!showCredentials); // Toggle the display of credentials
  };

  const displayValue = (value) => {
    return showCredentials ? `${value}` : '*'.repeat(value.length);
  };

  return (
    <Container>
      <Box my={4} textAlign="center">
        <Button
          variant="contained"
          color="primary"
          onClick={handleFetchCredentials}
          disabled={buttonDisabled}
        >
          {isFetched ? (showCredentials ? 'Hide Credentials' : 'Show Credentials') : 'Fetch Credentials'}
        </Button>
      </Box>
      {credentials && (
        <Box my={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fetched Credentials
            </Typography>
            <TextField
              label="Access Token"
              value={displayValue(credentials.accessToken)}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Subdomain"
              value={credentials.subdomain}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              label="Pair2"
              value={displayValue(credentials.pair2)}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
            {/* <TextField
              label="Pair1"
              value={displayValue(credentials.pair1)}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            /> */}
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default ShopifyCredentials;
