import Head from 'next/head';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { DashboardLayout } from '../components/general/dashboard-layout';
import { BotCard } from '../components/bots/bot-card';
import { BotWarnings } from '../components/bots/bot-warnings';
import { baseBots } from '../data/base_bots';

/**

Page component that display beet bots

 */

const Page = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Head>
                <title>Beet | Bots</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={false}>
                    <BotWarnings />
                    <Grid container
spacing={3}
mt={3}>
                        {baseBots.map((bot) => (
                            <Grid item
key={bot.id}
xs={12}
sm={6}
md={4}
lg={3}>
                                <BotCard bot={bot} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Page;