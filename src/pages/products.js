import Head from 'next/head';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { DashboardLayout } from '../components/general/dashboard-layout';
import api from '../lib/axios';

const Page = () => {
  // Get user products from API
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await api.get('/api/company-products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        if (response && response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          console.error('Invalid response:', response);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Products | Beedata</title>
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
          {products.length ? (
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {products.map((product) => (
                  <Grid item key={product.id} lg={4} md={6} xs={12}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontWeight: 'bold',
              }}
            >
              We're sorry, there are currently no active products. Please contact the Beet team for purchase.
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
