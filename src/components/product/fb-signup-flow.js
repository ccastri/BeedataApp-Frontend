import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';

/**
 * Setup the FB SDK and launch the WhatsApp Signup flow
 * 
 * @returns {JSX.Element} - The button to launch the WhatsApp Signup flow
 * 
 */

const sessionInfoListener = (event) => {
  if (event.origin !== "https://www.facebook.com") return;
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'WA_EMBEDDED_SIGNUP') {
      // if user finishes the embedded sign up flow
      if (data.event === 'FINISH') {
        const {phoneID, wabaID} = data.data;
      }
      // if user cancels the embedded sign up flow
      else {
        const{currentStep} = data.data;
      }
    }
  } catch {
    // Don’t parse info that’s not a JSON
    console.log('Non JSON Response', event.data);
  }
};

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

    window.addEventListener('message', sessionInfoListener);

    return () => window.removeEventListener('message', sessionInfoListener);

  }, []);

  const launchWhatsAppSignup = () => {
    if (typeof window !== 'undefined') {
      // Check if the FB object is defined before using it
      if (typeof FB !== 'undefined') {
        const fbq = window.fbq;
        fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {appId: '931235137882480', feature: 'whatsapp_embedded_signup' });

        FB.login(function (response) {
          if (response.authResponse) {
            const accessToken = response.authResponse.accessToken;
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        }, {
          scope: 'whatsapp_business_management',
          display: 'popup',
          auth_type: 'rerequest',
          extras: {
            feature: 'whatsapp_embedded_signup',
            "version": 2,
            "sessionInfoVersion": 2,
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
