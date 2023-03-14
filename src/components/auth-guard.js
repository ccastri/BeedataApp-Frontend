import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { axiosBase } from '../lib/axios'

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(null); // set initial state to null

  useEffect(() => {
    const token = localStorage.getItem('jwt');

    if (!token) {
      setIsAuthorized(false);
    } else {
      const verifyToken = async () => {
        try {
          const { data } = await axiosBase.post('/api/login/verify-token', {
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
        }
      };
      verifyToken();
    } 
  }, []);

  useEffect(() => {
    if (router.isReady && (status === 'unauthenticated' || !status) && isAuthorized === false) {
      router.replace({
        pathname: '/',
        query: router.asPath !== '/' ? { continueUrl: router.asPath } : undefined,
      }).catch(console.error);
    }
  }, [router.isReady, session, isAuthorized]);

  if (status === 'loading') {
    return null;
  }

  return children;
};
