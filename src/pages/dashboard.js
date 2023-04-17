import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WhatsappSms } from '../components/dashboard/whatsapp-sms';
import { Sales } from '../components/dashboard/sales';
import { SocialAgents } from '../components/dashboard/social-agents';
import { LakeRows } from '../components/dashboard/lake-rows';
import { TotalProfit } from '../components/dashboard/total-profit';
import { DashboardLayout } from '../components/general/dashboard-layout';

const Page = () => (
  <>
    <Head>
      <title>Beedata | Dashboard</title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 15
      }}
    >
      <Container sx={{ paddingLeft: 36, paddingRight: 36 }}>
        <Grid container
spacing={3}
justifyContent="center">
          <Grid item
xs={12}
sm={6}
md={4}
lg={4}
xl={4}>
            <WhatsappSms />
          </Grid>
          <Grid item
xs={12}
sm={6}
md={4}
lg={4}
xl={4}>
            <LakeRows />
          </Grid>
          <Grid item
xs={12}
sm={6}
md={4}
lg={4}
xl={4}>
            <SocialAgents />
          </Grid>
          <Grid item
xs={12}
lg={12}
xl={12}>
            <Sales />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
