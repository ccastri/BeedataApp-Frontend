import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { Budget } from '../components/dashboard/budget';
import { Sales } from '../components/dashboard/sales';
import { TasksProgress } from '../components/dashboard/tasks-progress';
import { TotalCustomers } from '../components/dashboard/total-customers';
import { TotalProfit } from '../components/dashboard/total-profit';
import { DashboardLayout } from '../components/dashboard-layout';


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
      <Container sx={{ paddingLeft: 40, paddingRight: 40 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Budget />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TotalCustomers />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TasksProgress />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TotalProfit sx={{ height: '100%' }} />
          </Grid>
          <Grid item xs={12}>
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
