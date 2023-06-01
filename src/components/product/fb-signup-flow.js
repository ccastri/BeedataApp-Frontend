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
        fjs.parentNode.insertBefore(js, fjs);
      })(document, 'script', 'facebook-jssdk');
    }
  }, []);

  const launchWhatsAppSignup = () => {
    if (typeof window !== 'undefined') {
      // Check if the FB object is defined before using it
      if (typeof FB !== 'undefined') {
        const fbq = window.fbq;
        fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {appId: '931235137882480', feature: 'whatsapp_embedded_signup' });

        FB.login(async function (response) {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
            const token = localStorage.getItem('jwt');

            try {
              const userData = await api.post('/api/fb-user-waba', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'x-access-token': accessToken,
                },
                mode: 'cors'
              });

            } catch (err) {
              console.log(err);
            }
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {
          scope: 'business_management,whatsapp_business_management',
          display: 'popup',
          extras: {
            feature: 'whatsapp_embedded_signup',
            version: 2,
            sessionInfoVersion: 2,
          }
        });
      }
    }
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      onClick={launchWhatsAppSignup}
    >
      { title }
    </Button>
  );
};
