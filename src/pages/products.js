import Head from 'next/head';
import { useState, useEffect } from 'react';
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
  const [pack, setPack] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/v1/products/company-all-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response && response.data && response.data.products) {
          setPack(response.data.products);
        }
        
      } catch (error) {
        console.error(error);
      }
      setLoading(false);
    }
    fetchData();
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
  }) : baseProducts.map(baseProduct => ({bulkProducts: {...baseProduct, isActive: false}}));

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