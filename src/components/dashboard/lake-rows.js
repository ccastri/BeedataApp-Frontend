import { useState, useEffect } from 'react';
import { StatsCard } from '../general/stats-cards';
import PropTypes from 'prop-types';
import api from '../../lib/axios';


export const LakeRows = ({ isConsumption, rowLimit }) => {
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const fetchRowCount = async () => {
      try {
        const response = await api.get('/api/v1/lake/row-count-by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { isConsumption: isConsumption }
        });
        
        if (response.data.success) {
          setRowCount(response.data.rowCount);
        } else if (response.status === 404) {
          console.log(response.data.message);
          setRowCount(0);
        } else {
          console.log(response.data.message);
          setErrorMessages(response.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRowCount();
  }, []);

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