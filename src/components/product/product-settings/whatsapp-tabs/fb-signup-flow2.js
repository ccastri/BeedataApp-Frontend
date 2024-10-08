import React, { useEffect, useContext } from 'react';
import { CompanyContext } from '../../../../contexts/company';
import { AuthContext } from '../../../../contexts/auth';
import Button from '@mui/material/Button';
import FacebookIcon from '@mui/icons-material/Facebook';
import api from '../../../../lib/axios';

/**
 * Setup the FB SDK and launch the WhatsApp Signup flow
 * (This sign up flow is use to connect a phone number
 * that already exists in Facebook Business Manager and has been registered)
 *
 * @returns {JSX.Element} - The button to launch the WhatsApp Signup flow
 *
 */
export const FbSignupFlow2 = ({title, onNext}) => {
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);

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
    }
  }, []);

  const launchWhatsAppSignup = () => {
    if (typeof window !== 'undefined') {
      // Check if the FB object is defined before using it
      if (typeof FB !== 'undefined') {
        FB.login(async function (response) {
          if (response.authResponse) {
            console.log(response);
            const signedRequest = response.authResponse.signedRequest;
            try {
              await api.get('/api/v1/facebook/callback', {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'x-access-token': signedRequest,
                },
                mode: 'cors',
                params: {
                  companyId: companyId,
                },
              });
              window.location.reload();

              if (onNext) onNext();
            } catch (err) {
              console.log(err);
            }
          }
          else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {
          scope: 'business_management, whatsapp_business_management, whatsapp_business_messaging',
          response_type: 'code'
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
      endIcon={<FacebookIcon />}
    >
      { title }
    </Button>
  );
};
