import { useState, useEffect } from 'react';
import { StatsCard } from './stats-cards';
import api from '../../lib/axios';


export const WhatsappSms = () => {
  const [msgCount, setMsgCount] = useState(0);
  const [msgMetric, setMsgMetric] = useState(0);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await api.get('/api/v1/purchases/active', {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        if (response.data.success) {
          const purchases = response.data.active;
          const filteredPurchases = purchases.filter(purchase => purchase.msg_qty > 0);
          const totalMsgCount = filteredPurchases.reduce((acc, purchase) => acc + purchase.msg_qty, 0);
          setMsgCount(totalMsgCount);
          return;
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
    <StatsCard
      title="Whatsapp SMS"
      image="/static/images/products/beet_whatsapp.svg"
      value={msgCount}
      metric={msgMetric}
      metricUp={false}
    />
  );
};
