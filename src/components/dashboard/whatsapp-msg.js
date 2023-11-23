import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';

export const WhatsappMsg = ({ isConsumption, msgLimit }) => {
  const [msgCount, setMsgCount] = useState(0);
  const { companyId } = useContext(CompanyContext);

  useEffect(() => {
    const token = Cookies.get('jwt')
    const fetchData = async () => {
      try {
        const messagesResponse = await api.get(`/api/v1/${companyId}/social/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { isConsumption: isConsumption, isRenewal: isConsumption ? false : true }
        });

        if (messagesResponse.data.success) {
          const totalMsgCount = messagesResponse.data.messages.reduce((prev, curr) => prev + curr.data.total.length, 0);
          setMsgCount(totalMsgCount);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isConsumption]);

  return (
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
      totalAmount={isConsumption ? 'Credit Dependent' : msgLimit > 0 ? msgLimit  : 'Not Available'}
    />
  );
};