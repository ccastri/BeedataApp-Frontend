import React, { useEffect, useContext } from 'react';
import { CompanyContext } from '../../../../context/company-context';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import api from '../../../../lib/axios';

/**
 * Setup the FB SDK and launch the WhatsApp Signup flow
 * 
 * @returns {JSX.Element} - The button to launch the WhatsApp Signup flow
 * 
 */

export const FbSignupFlow = ({title}) => {
  const { companyId } = useContext(CompanyContext);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.fbAsyncInit = function () {
        console.log('Initializing Facebook SDK...');
        FB.init({
          appId: '931235137882480',
          cookie: true,
          xfbml: true,
          version: 'v18.0'
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

      const sessionInfoListener = (event) => {
        if (event.origin !== "https://www.facebook.com") return;
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'WA_EMBEDDED_SIGNUP') {
            // if user finishes the Embedded Signup flow
            if (data.event === 'FINISH') {
              const {phone_number_id, waba_id} = data.data;
            }
            // if user cancels the Embedded Signup flow
            else {
             const{current_step} = data.data;
            }
          }
        } catch {
          // Don’t parse info that’s not a JSON
          console.log('Non JSON Response', event.data);
        }
      };

      window.addEventListener('message', sessionInfoListener);

      return () => {
        window.removeEventListener('message', sessionInfoListener);
      };
    }
  }, []);

  const launchWhatsAppSignup = () => {
    if (typeof window !== 'undefined') {
      // Check if the FB object is defined before using it
      if (typeof FB !== 'undefined') {
        FB.login(async function (response) {
          if (response.authResponse) {
            const code = response.authResponse.code;
            const token = Cookies.get('jwt')
            try {
              await api.get('/api/v1/facebook/callback', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'x-access-token': code,
                },
                mode: 'cors',
                params: {
                  companyId: companyId,
                }
              });

              window.location.reload();
            } catch (err) {
              console.log(err);
            }
          }
          else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {
          config_id: '244953425243988',
          response_type: 'code',
          override_default_response_type: true,
        });
      }
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={launchWhatsAppSignup}
      sx={{ ml: 2, mr: 2, mb: 2, mt: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
      data-testid='facebook-flow'
      endIcon={<FacebookIcon />}
    >
      { title }
    </Button>
  );
};
