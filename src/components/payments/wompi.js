import React from 'react';
import Script from 'next/script';
import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import api from '../../lib/axios';

export const Wompi = (props) => {
    const [integritySignature, setIntegritySignature] = useState('');
    const { amountInCents, reference } = props;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/wompi-signature');
                const signature = response.data.signature;
                setIntegritySignature(signature);
            } catch (error) {
                console.log(error);
            }
        };
    }, []);

    return (
        <>
          <Script
              strategy="afterInteractive"
              src="https://checkout.wompi.co/widget.js"
              data-render="button"
              data-public-key="pub_test_KKOCuWotfDSL3IR41wn3vPy3UVdhR966"
              data-currency="COP"
              data-redirect-url="https://transaction-redirect.wompi.co/check"
              data-amount-in-cents={amountInCents}
              data-reference={reference}
              data-signature-integrity={integritySignature}
              data-customer-data-email="lola@perez.com"
              data-customer-data-full-name="Lola Perez"
              data-customer-data-phone-number="3019777777"
              data-customer-data-phone-number-prefix="+57"
              data-customer-data-legal-id="123456789"
              data-customer-data-legal-id-type="CC"
          />
        </>
    );
};
