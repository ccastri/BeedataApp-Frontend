import { useState, useEffect } from 'react';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';

export const WhatsappMsg = ({ isConsumable, msgLimit }) => {
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const fetchData = async () => {
      try {
        const messagesResponse = await api.get('/api/v1/social/messages', {
          headers: { Authorization: `Bearer ${token}` },
          params: { isConsumable: isConsumable }
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
  }, []);

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
      totalAmount={isConsumable ? 'Unlimited' : msgLimit > 0 ? msgLimit  : 'Not Available'}
    />
  );
};