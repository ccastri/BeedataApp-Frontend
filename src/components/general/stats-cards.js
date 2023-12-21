import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

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
                        sx={{
                            mt: 2
                        }}
                    >
                        {props.value}
                    </Typography>
                </Grid>
                {props.image && (<Grid item
                    xs={6}
                    sx={{ textAlign: 'right' }}>
                    <img
                        src={props.image}
                        alt="Whatsapp"
                        style={{ width: '80%' }}
                    />
                </Grid>)}
            </Grid>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    pt: 2,
                    mb: 1
                }}
            >
                {props.totalAmount && (<Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{
                        mr: 1
                    }}
                >
                    {props.type} limit: {props.totalAmount}
                </Typography>)}
            </Box>
            {props.startDate && (
                <Box>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                            mr: 1,
                        }}
                    >
                        Since: {props.startDate}
                    </Typography>
                </Box>
            )}
        </CardContent>
    </Card>
);
