import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
// import { SessionProvider } from "next-auth/react"
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { registerChartJs } from '../utils/register-chart-js';
import { theme } from '../theme';
import { getUserCompanyId } from '../utils/get-user-data';
import { AuthProvider } from '../contexts/auth';
import { CompanyContext } from '../contexts/company';



registerChartJs();

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);
  const [companyId, setCompanyId] = useState(getUserCompanyId());

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Beet
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <CompanyContext.Provider value={{ companyId, setCompanyId }}>
              {getLayout(<Component {...pageProps} />)}
            </CompanyContext.Provider>
          </AuthProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
