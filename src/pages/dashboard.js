import React, { useEffect, useState, useContext} from 'react';
import Cookies from 'js-cookie';
import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WhatsappMsg } from '../components/dashboard/whatsapp-msg';
import { MsgInsOuts } from '../components/dashboard/msg-ins-outs';
import { SocialAgents } from '../components/dashboard/social-agents';
import { LakeRows } from '../components/dashboard/lake-rows';
import { DashboardLayout } from '../components/general/dashboard-layout';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../lib/axios';


const Page = () => {
  const [state, setState] = useState({
    msgLimit: 0,
    rowLimit: 0,
    activePurchases: [],
    isConsumption: null,
    loading: true,
  });

  const { companyId } = useContext(CompanyContext);
  const token = Cookies.get('jwt')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await api.get(`/api/v1/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (companyResponse.data.success) {
          const isConsumption = companyResponse.data.company.credit_msg_consumption;
          setState(prevState => ({
            ...prevState,
            isConsumption: isConsumption,
          }));

          const purchasesResponse = await api.get('/api/v1/purchases/active', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const { success, active } = purchasesResponse.data;

          if (success) {
            setState(prevState => ({
              ...prevState,
              activePurchases: active,
            }));

            const purchasesWithMsgs = active.filter(purchase => purchase.msg_qty > 0);
            const purchasesWithRows = active.filter(purchase => purchase.db_rows_qty > 0);

            if (purchasesWithMsgs.length > 0) {
              const purchaseMsgLimit = purchasesWithMsgs.reduce((prev, curr) => prev + curr.msg_qty, 0);
              setState(prevState => ({
                ...prevState,
                msgLimit: purchaseMsgLimit,
              }));
            }

            if (purchasesWithRows.length > 0) {
              const purchaseRowLimit = purchasesWithRows.reduce((prev, curr) => prev + curr.db_rows_qty, 0);
              setState(prevState => ({
                ...prevState,
                rowLimit: purchaseRowLimit,
              }));
            }
          } else {
            console.log(purchasesResponse.data.message);
          }

          setState(prevState => ({
            ...prevState,
            loading: false,
          }));
        } else {
          console.log(companyResponse.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token]);

  if (state.loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress
          data-testid='loading'
        />
      </Box>
    );
  }

  return (
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
              <WhatsappMsg isConsumption={state.isConsumption}
msgLimit={state.msgLimit} />
            </Grid>
            <Grid item
              xs={12}
              sm={6}
              md={4}
              lg={4}
              xl={4}>
              <LakeRows isConsumption={state.isConsumption}
rowLimit={state.rowLimit} />
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
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
