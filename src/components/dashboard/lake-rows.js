import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from '../../contexts/company';
import { AuthContext } from '../../contexts/auth';
import { StatsCard } from '../general/stats-cards';
import PropTypes from 'prop-types';
import api from '../../lib/axios';


export const LakeRows = ({ isConsumption, rowLimit }) => {
  const [rowCount, setRowCount] = useState(0);
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchRowCount = async () => {
      try {
        const response = await api.get(`/api/v1/${companyId}/lake/row-count`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { isConsumption: isConsumption }
        });
        
        if (response.data.success) {
          setRowCount(response.data.rowCount);
        } else {
          console.log(response.data.message);
          setErrorMessages(response.data.message);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          console.log(err.response.data.message);
          setRowCount(0);
        } else {
          console.log(err);
        }
      }
    };
    fetchRowCount();
  }, [isConsumption, companyId, token]);

  return (
      <StatsCard
        title={
          <>
            Lake Rows<br />
            Consumed
          </>
        }
        image="/static/images/products/beet_lake2.svg"
        value={rowCount}
        type="Rows"
        totalAmount={rowLimit > 0 ? rowLimit : 'Not Available'}
      />
  );
}

LakeRows.propTypes = {
  rowLimit: PropTypes.number.isRequired
};