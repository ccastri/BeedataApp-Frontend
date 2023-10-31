import { useState, useEffect } from 'react';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';

export const WhatsappMsg = () => {
  const [state, setState] = useState({
    msgCount: 0,
    msgLimit: 0,
    isConsumable: null,
  });

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companyResponse, purchasesResponse, messagesResponse] = await Promise.all([
          api.get('/api/v1/companies/company', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get('/api/v1/purchases/active', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          api.get('/api/v1/social/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              isRenewal: state.isConsumable === null ? true : null,
              isConsumable: state.isConsumable,
            },
          })
        ]);

        if (companyResponse.data.success) {
          setState(prevState => ({
            ...prevState,
            isConsumable: companyResponse.data.company.credit_msg_consumption,
          }));
        } else {
          console.log(companyResponse.data.message);
        }

        const { success, active } = purchasesResponse.data;

        if (success) {
          const purchasesWithMsgs = active.filter(purchase => purchase.msg_qty > 0);

          if (purchasesWithMsgs.length > 0) {
            const purchaseMsgLimit = purchasesWithMsgs.reduce((prev, curr) => prev + curr.msg_qty, 0);
            setState(prevState => ({
              ...prevState,
              msgLimit: purchaseMsgLimit,
            }));
          }
        } else {
          console.log(purchasesResponse.data.message);
        }

        if (messagesResponse.data.success) {
          const totalMsgCount = messagesResponse.data.messages.reduce((prev, curr) => prev + curr.data.total.length, 0);
          setState(prevState => ({
            ...prevState,
            msgCount: totalMsgCount,
          }));
        } else {
          console.log(messagesResponse.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [token, state.isConsumable]);

  return (
    <StatsCard
      title={
        <>
          Whatsapp Msg<br />
          Consumed
        </>
      }
      image="/static/images/products/beet_whatsapp.svg"
      value={state.msgCount}
      type="Messages"
      totalAmount={state.isConsumable ? 'Unlimited' : state.msgLimit > 0 ? state.msgLimit  : 'Not Available'}
    />
  );
};