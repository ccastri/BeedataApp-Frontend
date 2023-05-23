import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { BalanceSection } from '../components/payments/balance-section';
import { BillingPreferences } from '../components/payments/billing-preferences';
import { PurchaseSummary } from '../components/payments/purchase-summary';
import { BillingHistory } from '../components/payments/billing-history';
import { DashboardLayout } from '../components/general/dashboard-layout';


const Page = () => (
  <>
    <Head>
      <title>
        Payment | Beet
      </title>
    </Head>
    <Box sx={{ flexGrow: 1, pt: 10 }}>
      <Container maxWidth="lg">
        <Grid container
spacing={3}>
          <Grid item
xs={12}
md={6}>
            <BalanceSection title="Balance Information" />
          </Grid>
          <Grid item
xs={12}
md={6}>
            <BillingPreferences title="Billing Preferences" />
          </Grid>
          <Grid item
xs={12}>
            <PurchaseSummary title="Purchase Summary" />
          </Grid>
          <Grid item
xs={12}>
            <BillingHistory title="Billing History" />
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
