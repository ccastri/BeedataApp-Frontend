import Head from 'next/head';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { baseProducts } from '../data/base_products';
import { DashboardLayout } from '../components/general/dashboard-layout';
import api from '../lib/axios';

/**

Page component that displays user products

Dependencies:
Usage:
 */

const Page = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/company-all-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
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

  return (
    <>
      <Head>
        <title>Products | Beet</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar />
          <Grid container spacing={3} mt={3}>
            {baseProducts.map((baseProduct) => {
              const activeProduct = products.find(
                (product) => product.name.includes(baseProduct.name)
              );
              const isActive = Boolean(activeProduct);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={baseProduct.id}>
                  <ProductCard
                    product={baseProduct}
                    isActive={isActive}
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

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
