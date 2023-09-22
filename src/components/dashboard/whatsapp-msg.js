import { useState, useEffect } from 'react';
import { StatsCard } from '../general/stats-cards';
import ErrorSnackbar from '../settings/settings-error-msg';
import api from '../../lib/axios';


export const WhatsappMsg = () => {
  const [msgCount, setMsgCount] = useState(0);
  const [msgLimit, setMsgLimit] = useState(0);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchMsgLimit = async () => {
      try {
        const response = await api.get('/api/v1/purchases/active', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const { success, active } = response.data;
  
        if (success) {
          const purchasesWithMsgs = active.filter(purchase => purchase.msg_qty > 0);
  
          if (purchasesWithMsgs.length > 0) {
            const purchaseMsgLimit = purchasesWithMsgs.reduce((prev, curr) => prev + curr.msg_qty, 0);
            setMsgLimit(purchaseMsgLimit);
          }
        } else {
          console.log(response.data.message);
          setError(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMsgLimit();
  }, [token]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.post('/api/v1/social/messages', {
          isRenewal: true,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        if ( response.data.success ) {
          const totalMsgCount = response.data.messages.reduce((prev, curr) => prev + curr.data.total.length, 0);
          console.log(totalMsgCount)
          setMsgCount(totalMsgCount);
        } else {
          console.log(response.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchPurchases();
  }, [token]);

  return (
    <>
      <StatsCard
        title={
          <>
            Whatsapp Msg<br />
            Consumed
          </>
        }
        image="/static/images/products/beet_whatsapp.svg"
        value={msgCount}
        type="Messages"
        totalAmount={msgLimit}
      />
      {error && <ErrorSnackbar errorMessage={error} />}
    </>
  );
};
