import Head from 'next/head';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { DashboardLayout } from '../components/general/dashboard-layout';
import api from '../lib/axios';


/**
 * Page component that displays user products fetched from the API.
 * 
 * Dependencies: Head, useState, useEffect, Box, Container, Grid, 
 *               CircularProgress, ProductListToolbar, ProductCard, DashboardLayout, api
 * Usage: This component is rendered on the /products page of the application. 
 *        It fetches the user's products from the API and displays them in a grid or an 
 *        error message if there are no active products. It implements the DashboardLayout
 *        component as a layout wrapper.
 */

const Page = () => {
  // Get user products from API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's products from the API when the page loads
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
        setLoading(false);

        // If the response is valid, set the products state variable
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
          {loading ? ( // Render CircularProgress if loading state is true
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontWeight: 'bold',
              }}
            >
              <CircularProgress />
            </Box>
          ) : products.length ? ( // Conditionally render product list if products exist
            <Box sx={{ pt: 3 }}>
              <Grid container
spacing={3}>
                {products.map((product) => (
                  <Grid item
key={product.id}
lg={4}
md={6}
xs={12}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : ( // Render error message if no products exist
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                fontWeight: 'bold',
              }}
            >
              We&apos;re sorry, there are currently no active products. Please contact the Beet team for purchase.
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
