import React, { useEffect, useReducer, useContext } from 'react';
import { CompanyContext } from '../contexts/company';
import { AuthContext } from '../contexts/auth';
import Head from 'next/head';
import { Box, Container, Grid } from '@mui/material';
import { WhatsappMsg } from '../components/dashboard/whatsapp-msg';
import { MsgInsOuts } from '../components/dashboard/msg-ins-outs';
import { SocialAgents } from '../components/dashboard/social-agents';
import { LakeRows } from '../components/dashboard/lake-rows';
import { DashboardLayout } from '../components/general/dashboard-layout';
import CircularProgress from '@mui/material/CircularProgress';
import api from '../lib/axios';

const initialState = {
  msgLimit: 0,
  rowLimit: 0,
  activePurchases: [],
  isConsumption: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_COMPANY':
      return { ...state, isConsumption: action.payload.isConsumption };
    case 'SET_PURCHASES':
      return { ...state, activePurchases: action.payload.activePurchases, msgLimit: action.payload.msgLimit, rowLimit: action.payload.rowLimit };
    case 'SET_LOADING':
      return { ...state, loading: action.payload.loading };
    default:
      throw new Error();
  }
}

const Page = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const companyResponse = await api.get(`/api/v1/companies/${companyId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (companyResponse.data.success) {
          dispatch({ type: 'SET_COMPANY', payload: { isConsumption: companyResponse.data.company.credit_msg_consumption } });

          const purchasesResponse = await api.get(`/api/v1/${companyId}/purchases/active`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (purchasesResponse.data.success) {
            const active = purchasesResponse.data.active;
            const purchasesWithMsgs = active.filter(purchase => purchase.msg_qty > 0);
            const purchasesWithRows = active.filter(purchase => purchase.db_rows_qty > 0);
            const msgLimit = purchasesWithMsgs.reduce((prev, curr) => prev + curr.msg_qty, 0);
            const rowLimit = purchasesWithRows.reduce((prev, curr) => prev + curr.db_rows_qty, 0);

            dispatch({ type: 'SET_PURCHASES', payload: { activePurchases: active, msgLimit, rowLimit } });
          }

          dispatch({ type: 'SET_LOADING', payload: { loading: false } });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token, companyId]);

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
              <LakeRows companyId={companyId} isConsumption={state.isConsumption}
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
