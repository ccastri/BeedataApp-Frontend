import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const LakeRows = (props) => (
  <Card sx={{ maxWidth: '100%', height: '90%' }}
{...props}>
    <CardContent>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-between' }}
      >
        <Grid item>
          <Typography
            color="textSecondary"
            gutterBottom
            variant="overline"
          >
            LAKE ROWS
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            1,6K
          </Typography>
        </Grid>
        <Grid item
xs={6}
sx={{ textAlign: 'right' }}>
          <img
            src="/static/images/products/lake.svg"
            alt="Whatsapp"
            style={{ width: '80%' }}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          pt: 2
        }}
      >
        <ArrowUpwardIcon color="success" />
        <Typography
          variant="body2"
          sx={{
            mr: 1
          }}
        >
          16%
        </Typography>
        <Typography
          color="textSecondary"
          variant="caption"
        >
          Since last month
        </Typography>
      </Box>
    </CardContent>
  </Card>
);
