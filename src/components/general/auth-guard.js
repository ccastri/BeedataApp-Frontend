import React, { useReducer, useEffect, useContext  } from 'react';
import { AuthContext } from '../../contexts/auth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
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

  const initialState = {
    isAuthorized: null,
    verificationComplete: false,
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'SET_AUTHORIZED':
        return { ...state, isAuthorized: true };
      case 'SET_UNAUTHORIZED':
        return { ...state, isAuthorized: false };
      case 'SET_VERIFICATION_COMPLETE':
        return { ...state, verificationComplete: true };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const { token, logout } = useContext(AuthContext);

  useEffect(() => {

    if (!token) {
      dispatch({ type: 'SET_UNAUTHORIZED' });
      dispatch({ type: 'SET_VERIFICATION_COMPLETE' });
    } else {
      const verifyToken = async () => {
        try {
          const { data } = await api.post('/api/verify-token', {}, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (data.success) {
            dispatch({ type: 'SET_AUTHORIZED' });
          } else {
            dispatch({ type: 'SET_UNAUTHORIZED' });
            logout();
          }
        } catch (err) {
          dispatch({ type: 'SET_UNAUTHORIZED' });
          logout();
          console.error(err);
        } finally {
          setTimeout(() => {
            dispatch({ type: 'SET_VERIFICATION_COMPLETE' });
          }, 500);
        }
      };
      verifyToken();
    } 
  }, [token]);

  useEffect(() => {
    if (router.isReady && state.verificationComplete && state.isAuthorized === false) {
      try {
        router.replace({
          pathname: '/',
          query: { continueUrl: router.asPath },
        });
      } catch (error) {
        console.error(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, state.isAuthorized, state.verificationComplete]);

  if (!state.verificationComplete) {
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
