import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/axios';

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(null); // set initial state to null
  const [verificationComplete, setVerificationComplete] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      setIsAuthorized(false);
      setVerificationComplete(true);
    } else {
      const verifyToken = async () => {
        try {
          const { data } = await api.post('/api/verify-token', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (data.success) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            localStorage.removeItem('jwt');
          }
        } catch (err) {
          setIsAuthorized(false);
          localStorage.removeItem('jwt');
          console.error(err);
        } finally {
          setTimeout(() => {
            setVerificationComplete(true);
          }, 500);
        }
      };
      verifyToken();
    } 
  }, []);

  useEffect(() => {
    if (router.isReady && verificationComplete && isAuthorized === false) {
      try {
        router.replace({
          pathname: '/',
          query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined,
        });
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, isAuthorized, verificationComplete]);

  if (!verificationComplete) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress data-testid="loading-indicator" />
      </Box>
    );
  }

  return children;
};
