import { Avatar, Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const WhatsappSms = (props) => (
  <Card sx={{ maxWidth: '100%', height: '90%' }}
{...props}>
    <CardContent>
      <Grid container
spacing={3}
alignItems="flex-start">
        <Grid item
xs={6}>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            Whatsapp SMS
          </Typography>
          <Typography color="textPrimary"
variant="h4">
            1,600
          </Typography>
        </Grid>
        <Grid item
xs={6}
sx={{ textAlign: 'right' }}>
          <img
            src="/static/images/products/whatsappbee.svg"
            alt="Whatsapp"
            style={{ width: '80%' }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          pt: 2,
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ArrowDownwardIcon color="error" />
        <Typography
          color="error"
          sx={{
            mr: 1
          }}
          variant="body2"
        >
          12%
        </Typography>
        <Typography color="textSecondary"
variant="caption">
          Since last month
        </Typography>
      </Box>
    </CardContent>
</Card>
);
