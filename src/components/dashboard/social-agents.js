import { Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';


export const SocialAgents = (props) => (
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
            SOCIAL AGENTS
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            90%
          </Typography>
        </Grid>
        <Grid item
xs={6}
sx={{ textAlign: 'right' }}>
          <img
            src="/static/images/products/beet_social.svg"
            alt="social"
            style={{ width: '80%' }}
          />
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={90}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
);
