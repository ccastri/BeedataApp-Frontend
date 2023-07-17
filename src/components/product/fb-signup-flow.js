import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import api from '../../lib/axios';

/**
 * Setup the FB SDK and launch the WhatsApp Signup flow
 * 
 * @returns {JSX.Element} - The button to launch the WhatsApp Signup flow
 * 
 */

export const FbSignupFlow = ({title}) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = function () {
        console.log('Initializing Facebook SDK...');
        FB.init({
          appId: '931235137882480',
          cookie: true,
          xfbml: true,
          version: 'v16.0'
        });

        FB.AppEvents.logPageView();
      };

      // Load the Facebook SDK script
      (function (d, s, id) {
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk.js';
        if (fjs) {
          fjs.parentNode.insertBefore(js, fjs);
        } else {
          document.head.appendChild(js);
        }
      })(document, 'script', 'facebook-jssdk');
    }
  }, []);

  const launchWhatsAppSignup = () => {
    if (typeof window !== 'undefined') {
      // Check if the FB object is defined before using it
      if (typeof FB !== 'undefined') {
        FB.login(async function (response) {
          console.log('FB response: ', response);
          console.log('Current URL:', window.location.href);
          if (response.authResponse) {
            const signedRequest = response.authResponse.signedRequest;
            const token = localStorage.getItem('jwt');
            try {
              const userData = await api.post('/api/v1/facebook/fb-user-token', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'x-access-token': signedRequest,
                },
                params: {
                  redirectUri: window.location.href
                },
                mode: 'cors'
              });

            } catch (err) {
              console.log(err);
            }
          }
          else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {
          config_id: '3471523013132484', // configuration ID goes here
          response_type: 'code' 
        });
      }
    }
  };

  return (
    <Button
      variant="outlined"
      fullWidth
      color="primary"
      onClick={launchWhatsAppSignup}
      sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
    >
      { title }
    </Button>
  );
};
