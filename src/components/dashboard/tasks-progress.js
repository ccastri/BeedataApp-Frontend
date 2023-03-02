import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';

export const TasksProgress = (props) => (
  <Card
    sx={{ height: '100%' }}
    {...props}
  >
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
            META CONVERSION RATE
          </Typography>
          <Typography
            color="textPrimary"
            variant="h4"
          >
            8.5%
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: '#1877f2',
              height: 56,
              width: 56
            }}
          >
            <FacebookIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress
          value={8.5}
          variant="determinate"
        />
      </Box>
    </CardContent>
  </Card>
);
