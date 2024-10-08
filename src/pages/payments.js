import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { BalanceSection } from '../components/payments/balance-section';
import { BillingPreferences } from '../components/payments/billing-preferences';
import { PurchaseSummary } from '../components/payments/purchase-summary';
import { CreditHistory } from '../components/payments/credit-history';
import { DashboardLayout } from '../components/general/dashboard-layout';
import ProductConsumption from '../components/payments/consumption';


const Page = () => (
  <>
    <Head>
      <title>
        Payments | Beet
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
            <CreditHistory title="Recharge History" />
          </Grid>
          <Grid item
xs={12}>
            <ProductConsumption />
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
