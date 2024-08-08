import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from '../../contexts/company';
import { AuthContext } from '../../contexts/auth';
import { StatsCard } from '../general/stats-cards';
import api from '../../lib/axios';

const fetchAgentsPurchased = async (companyId, token, setTotalSocialAgents) => {
  try {
    const response = await api.get(`/backend/api/v1/${companyId}/purchases/active`, {
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
  } catch (err) {
    console.log(err);
  }
};

const fetchSocialAgents = async (companyId, token, setSocialAgents) => {
  try {
    const response = await api.get(`/backend/api/v1/${companyId}/social/agents`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (response.data.success) {
      const agents = response.data.agents;
      setSocialAgents(agents.length);
    } else {
      console.log(response.data.message);
    }
  } catch (err) {
    console.log(err);
  }
};

export const SocialAgents = () => {
  const [socialAgents, setSocialAgents] = useState(0);
  const [totalSocialAgents, setTotalSocialAgents] = useState(0);
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    try {
      fetchAgentsPurchased(companyId, token, setTotalSocialAgents);
    } catch (err) {
      console.log(err);
    }
  }, [token, companyId]);

  useEffect(() => {
    try {
      fetchSocialAgents(companyId, token, setSocialAgents);
    } catch (err) {
      console.log(err);
    }
  }, [token, companyId]);

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
