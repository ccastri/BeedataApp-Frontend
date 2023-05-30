import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export const ProductWarnings = (props) => (
  <Box {...props}>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        Products
      </Typography>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box>
            <Stack sx={{ width: '100%' }} spacing={2}>
              <Alert severity="info">
                Before using our <b>bots</b>, please make sure to configure your business WhatsApp account.
                This will ensure that you can receive messages from our bots and get the most out of our services.
              </Alert>
              <Alert severity="warning">
                Please note that in order to purchase any product, you must have sufficient credit on your account.
                To check your current credit balance, click <Link href="/payments">here</Link>.
              </Alert>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>
);
