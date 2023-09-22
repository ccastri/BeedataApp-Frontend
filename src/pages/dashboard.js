import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WhatsappMsg } from '../components/dashboard/whatsapp-msg';
import { MsgInsOuts } from '../components/dashboard/msg-ins-outs';
import { SocialAgents } from '../components/dashboard/social-agents';
import { LakeRows } from '../components/dashboard/lake-rows';
import { DashboardLayout } from '../components/general/dashboard-layout';

const Page = () => (
  <>
    <Head>
      <title>Beet | Dashboard</title>
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
            <WhatsappMsg />
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
            <MsgInsOuts />
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
