import React, { useReducer, useEffect, useCallback, useContext } from 'react';
import { CompanyContext } from '../contexts/company';
import { AuthContext } from '../contexts/auth';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductWarnings } from '../components/product/product-warnings';
import { ProductCard } from '../components/product/product-card';
import { baseProducts } from '../data/base_products';
import { DashboardLayout } from '../components/general/dashboard-layout';
import api from '../lib/axios';


const getProductDetails = async (pack, token) => {
  try {
    const updatedPack = await Promise.all(pack.map(async (product) => {
      const response = await api.get(`/api/v1/products/${product.product_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Original product:', product); // Log original product
      return Object.assign({}, product, response.data.product);
    }));

    console.log('Updated product list:', updatedPack); // Log updated product list
    return updatedPack;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error; // Optionally re-throw the error to handle it upstream
  }
};


const updateBaseProducts = (pack, baseProducts) => {
  const packProductDict = {};

  pack.forEach(packProduct => {
    if (packProduct.msg_qty === 1 && packProduct.msg_qty !== null) {
      packProductDict[1] = packProduct;
    }
    if (packProduct.agents_qty !== 0 && packProduct.agents_qty !== null) {
      packProductDict[5] = packProduct;
    }
    if (packProduct.msg_qty > 1 && packProduct.msg_qty !== null) {
      packProductDict[2] = packProduct;
    }
    if (packProduct.db_rows_qty !== 0 && packProduct.db_rows_qty !== null) {
      packProductDict[4] = packProduct;
    }
  });

  const updatedBaseProducts = baseProducts.map(baseProduct => {
    if (packProductDict[baseProduct.id]) {
      const { id, name, ...activeProductDataReduce } = packProductDict[baseProduct.id];
      return { ...baseProduct, ...activeProductDataReduce, isActive: true };
    } else {
      return { ...baseProduct, isActive: false };
    }
  });

  return updatedBaseProducts;
};

const initialState = {
  pack: [],
  wabas: [],
  isConsumption: false,
  accessToken: false,
  credit: 0,
  responseMessage: '',
  errorMessage: '',
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_DATA':
      return { ...state, ...action.payload, loading: false };
    case 'UPDATE_COMPANY_CONSUMPTION':
      return { ...state, isConsumption: action.payload.newStatus, credit: action.payload.credit, responseMessage: action.payload.message };
    case 'SET_ERROR_MESSAGE':
      return { ...state, errorMessage: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, responseMessage: '', errorMessage: '' };
    case 'UPDATE_WABAS':
      return { ...state, wabas: action.payload };
    case 'DELETE_ROW':
      return { ...state, wabas: state.wabas.filter(waba => waba.phone_id !== action.payload) };
    default:
      throw new Error();
}
}

/**

Page component that displays user purchased products information.

Dependencies: Head, useState, useEffect, Box, Container, Grid, CircularProgress,
              ProductWarnings, ProductCard, baseProducts, DashboardLayout, api.
Usage: Used to display user purchased products base on Beet's base products.
 */

const Page = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { pack, wabas, accessToken, isConsumption, credit, responseMessage, errorMessage, loading } = state;
  const { companyId } = useContext(CompanyContext);
 const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      const [purchaseResponse, wabasResponse, companyResponse] = await Promise.all([
        api.get(`/api/v1/${companyId}/purchases/active`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/api/v1/${companyId}/whatsapp`, { headers: { Authorization: `Bearer ${token}` } }),
        api.get(`/api/v1/companies/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const updatedPack = await getProductDetails(purchaseResponse.data.active, token);

      dispatch({
        type: 'FETCH_DATA',
        payload: {
          pack: updatedPack,
          wabas: wabasResponse.data.wabas,
          isConsumption: companyResponse.data.company.credit_msg_consumption ? true : false,
          accessToken: companyResponse.data.company.facebook_token ? true : false,
          credit: parseFloat(companyResponse.data.company.credit),
        },
      });
    };

    fetchData();
  }, [token, companyId]);

  const updateCompanyConsumption = useCallback(async (newStatus) => {
    try {
      const updateInfo = newStatus ? Date.now() : null;
      const updatedCompany = await api.put(`/api/v1/companies/${companyId}`, { creditMsgConsumption: updateInfo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (updatedCompany.data.success) {
        dispatch({
          type: 'UPDATE_COMPANY_CONSUMPTION',
          payload: {
            newStatus: newStatus,
            credit: updatedCompany.data.company.credit,
            message: updatedCompany.data.message
          }
        });
      } else {
        dispatch({
          type: 'SET_ERROR_MESSAGE',
          payload: updatedCompany.data.message
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        dispatch({ type: 'CLEAR_MESSAGES' });
      }, 4000);
    }
  }, [token, companyId]);
  
  const updateWabas = useCallback((phoneId, inboxId = null) => {
    const updatedWabas = state.wabas.map(waba => {
      if (waba.phone_id === phoneId) {
        return { ...waba, cw_inbox_id: inboxId };
      }
      return waba;
    });
    dispatch({ type: 'UPDATE_WABAS', payload: updatedWabas });
  }, [state.wabas]);
  
  const deleteRow = useCallback((phoneId) => {
    dispatch({ type: 'DELETE_ROW', payload: phoneId });
  }, []);
  
  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
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

  const updatedBaseProducts = updateBaseProducts(pack, baseProducts);

  return (
    <>
      <Head>
        <title>Beet | Products</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductWarnings />
          <Grid container
            spacing={3}
            mt={3}>
            {updatedBaseProducts.map((product) => {
              return (
                <Grid item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product.id}>
                  <ProductCard
                    product={product}
                    wabas={wabas}
                    updateWabas={updateWabas}
                    deleteRow={deleteRow}
                    isConsumption={isConsumption}
                    credit={credit}
                    accessToken={accessToken}
                    responseMessage={responseMessage}
                    errorMessage={errorMessage}
                    updateCompanyConsumption={updateCompanyConsumption}
                    clearMessages={clearMessages}
                  />
                </Grid>
              );
            })}
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
