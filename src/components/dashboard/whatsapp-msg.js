import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { CompanyContext } from '../../contexts/company';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';

export const WhatsappMsg = ({ isConsumption, msgLimit }) => {
  const [msgCount, setMsgCount] = useState(0);
  const [msgCountDate, setMsgCountDate ] = useState('');
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const messagesResponse = await api.get(`/backend/api/v1/${companyId}/social/messages`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { isConsumption: isConsumption, isRenewal: isConsumption ? false : true }
        });

        if (messagesResponse.data.success) {
          const totalMsgCount = messagesResponse.data.messages.reduce((prev, curr) => prev + curr.data.total.length, 0);
          const date = messagesResponse.data.startDate ? new Date(messagesResponse.data.startDate) : null
          const friendlyDate = date ? date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null;
          setMsgCount(totalMsgCount);
          setMsgCountDate(friendlyDate);
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isConsumption, companyId, token]);

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
      startDate={msgCountDate ? msgCountDate : undefined}
    />
  );
};