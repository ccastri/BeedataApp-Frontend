import React from 'react';
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../lib/axios';


/**
 * AuthGuard component
 * 
 * @param {Object} props - The properties passed to the component
 * 
 * @returns {JSX.Element} - The JSX representation of the auth guard component
 * 
 */
export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(null); // set initial state to null
  const [verificationComplete, setVerificationComplete] = useState(false);

  const getToken = () => {
    return Cookies.get('jwt');
  };

  useEffect(() => {
    const token = getToken();

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
            Cookies.remove('jwt');
          }
        } catch (err) {
          setIsAuthorized(false);
          Cookies.remove('jwt');
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
        router.push({
          pathname: '/',
          query: { continueUrl: router.asPath },
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
