import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const StatsCard = (props) => (
    <Card sx={{ maxWidth: '100%', height: '90%' }}>
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
                        {props.title}
                    </Typography>
                    <Typography
                        color="textPrimary"
                        variant="h4"
                    >
                        {props.value}
                    </Typography>
                </Grid>
                <Grid item
                    xs={6}
                    sx={{ textAlign: 'right' }}>
                    <img
                        src={props.image}
                        alt="Whatsapp"
                        style={{ width: '80%' }}
                    />
                </Grid>
            </Grid>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    pt: 2,
                    mb: 2
                }}
            >
                {props.metricUp ? <ArrowUpwardIcon color="success" /> : <ArrowDownwardIcon color="error" />}
                <Typography
                    variant="body2"
                    sx={{
                        mr: 1
                    }}
                >
                    {props.metric} %
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
