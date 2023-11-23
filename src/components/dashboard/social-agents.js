import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';



export const SocialAgents = () => {
  const [socialAgents, setSocialAgents] = useState(0);
  const [totalSocialAgents, setTotalSocialAgents] = useState(0);
  const token = Cookies.get('jwt');
  const { companyId } = useContext(CompanyContext);

  useEffect(() => {
    try {
      const fetchAgentsPurchased = async () => {
        const response = await api.get(`/api/v1/${companyId}/purchases/active`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const purchases = response.data.active;
          const filteredPurchases = purchases.filter(purchase => purchase.agents_qty > 0);
          const totalAgentsPurchased = filteredPurchases.reduce((acc, purchase) => acc + purchase.agents_qty, 0);
          setTotalSocialAgents(totalAgentsPurchased);
        } else {
          console.log(response.data.message);
        }
      };

      fetchAgentsPurchased();
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  useEffect(() => {
    try {
      const fetchSocialAgents = async () => {
        const response = await api.get(`/api/v1/${companyId}/social/agents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.success) {
          const agents = response.data.agents;
          setSocialAgents(agents.length);
          return;
        } else {
          console.log(response.data.message);
        }
      };

      fetchSocialAgents();
    } catch (err) {
      console.log(err);
    }
  }, [token]);

  return (
    <StatsCard
      title={
        <>
          Social Agents<br />
          Assigned
        </>
      }
      image="/static/images/products/beet_social2.svg"
      value={socialAgents}
      type="Agents"
      totalAmount={totalSocialAgents > 0 ? totalSocialAgents : 'Not Available'}
    />
  )
}
