import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import Button from '@mui/material/Button';

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
            const fbq = window.fbq;
            fbq && fbq('trackCustom', 'WhatsAppOnboardingStart', {appId: '931235137882480', feature: 'whatsapp_embedded_signup'});
      
            FB.login(function (response) {
                if (response.authResponse) {
                    const accessToken = response.authResponse.accessToken;
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {
                scope: 'whatsapp_business_management',
                extras: {
                    feature: 'whatsapp_embedded_signup',
                    setup: {
                        // ... // Prefilled data can go here
                    }
                },
                window_width: 800,
                window_height: 600
            });
        }
    };
  
    return (
        <>
            <Script strategy="lazyOnload" />
            <Button
                variant="outlined"
                color="primary"
                onClick={launchWhatsAppSignup}
            >
                { title }
            </Button>
        </>
    )
}
