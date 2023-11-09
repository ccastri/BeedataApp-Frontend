import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductWarnings } from '../components/product/product-warnings';
import { ProductCard } from '../components/product/product-card';
import { baseProducts } from '../data/base_products';
import { DashboardLayout } from '../components/general/dashboard-layout';
import api from '../lib/axios';

/**

Page component that displays user purchased products information.

Dependencies: Head, useState, useEffect, Box, Container, Grid, CircularProgress,
              ProductWarnings, ProductCard, baseProducts, DashboardLayout, api.
Usage: Used to display user purchased products base on Beet's base products.
 */

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    pack: [],
    wabas: [],
    isConsumption: false,
    accessToken: false,
    credit: 0,
    responseMessage: '',
    errorMessage: '',
  });

  const { pack, wabas, accessToken, isConsumption, credit, responseMessage, errorMessage } = state;
  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchData = async () => {
      const [packResponse, wabasResponse, companyResponse] = await Promise.all([
        api.get('/api/v1/products/company-all-products', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/whatsapp/business-account', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/api/v1/companies/company', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setState(prevState => ({
        ...prevState,
        pack: packResponse.data.products,
        wabas: wabasResponse.data.wabas,
        isConsumption: companyResponse.data.company.credit_msg_consumption ? true : false,
        accessToken: companyResponse.data.company.facebook_token ? true : false,
        credit: parseFloat(companyResponse.data.company.credit),
      }));

      setLoading(false);
    };

    fetchData();
  }, []);


  const updateCompanyConsumption = useCallback(async (newStatus) => {
    try {
      const updateInfo = newStatus ? Date.now() : null;
      const updatedCompany = await api.put('/api/v1/companies/update-company', { creditMsgConsumption: updateInfo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatedCompany.data.success) {
        setState(prevState => ({ ...prevState, isConsumption: newStatus, credit: updatedCompany.data.company.credit, 
                                responseMessage: updatedCompany.data.message }));
      } else {
        setState(prevState => ({ ...prevState, errorMessage: updatedCompany.data.message }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
      }, 4000);
    }
  }, []);

  const updateWabas = useCallback((phoneId, departmentId = null) => {
    setState(prevState => {
      const updatedWabas = prevState.wabas.map(waba => {
        if (waba.phone_id === phoneId) {
          return { ...waba, department_id: departmentId };
        }
        return waba;
      });
      return { ...prevState, wabas: updatedWabas };
    });
  }, []);


  const deleteRow = useCallback((phoneId) => {
    setState(prevState => {
      const updatedWabas = prevState.wabas.filter(waba => waba.phone_id !== phoneId);
      return { ...prevState, wabas: updatedWabas };
    });
  }, []);

  const clearMessages = useCallback(() => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
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

  const products = pack.length > 0 ? pack.map(product => {
    const bulkProducts = baseProducts.map(baseProduct => {
      if (product.beet_app_product && product.beet_app_product.includes(baseProduct.name)) {
        return {
          ...baseProduct,
          details: {
            display_name: product.display_name || '',
            create_date: product.create_date || '',
            beet_expiration_time: product.beet_expiration_time || '',
            beet_renewal_time: product.beet_renewal_time || '',
            beet_renewal_exp_unit: product.beet_renewal_exp_unit || '',
          },
          beet_app_product: product.beet_app_product,
          isActive: true,
        };
      } else {
        return {
          ...baseProduct,
          isActive: false,
        };
      }
    });

    return {
      bulkProducts,
    };
  }) : baseProducts.map(baseProduct => ({ bulkProducts: { ...baseProduct, isActive: false } }));

  const allBulkProducts = products.flatMap(product => product.bulkProducts);

  const distinctBulkProducts = allBulkProducts.reduce((acc, bulkProduct) => {
    const existingIndex = acc.findIndex(p => p.id === bulkProduct.id);

    if (existingIndex !== -1) {
      const existingProduct = acc[existingIndex];

      if (!existingProduct.isActive && bulkProduct.isActive) {
        acc.splice(existingIndex, 1);
        acc.push(bulkProduct);
      }
    } else {
      acc.push(bulkProduct);
    }

    return acc;
  }, []);

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
            {distinctBulkProducts.map((product) => {
              return (
                <Grid item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  key={product.id}>
                  <ProductCard
                    product={product}
                    purchaseDetails={product.details}
                    beetDetails={product.beet_app_product}
                    isActive={product.isActive}
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