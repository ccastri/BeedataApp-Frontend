import { useState, useEffect } from 'react';
import { StatsCard } from './stats-cards';
import api from '../../lib/axios';


export const LakeRows = () => {
  const [lakeRows, setLakeRows] = useState(0);
  const [lakeRowsMetric, setLakeRowsMetric] = useState(0);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchRowCount = async () => {
      try {
        const response = await api.get('/api/v1/lake/company-row-count', {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        if (response.data.success) {
          setLakeRows(response.data.rowCount);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRowCount();
  }, [token]);

  return (
    <StatsCard
      title="Lake Rows"
      image="/static/images/products/beet_lake2.svg"
      value={lakeRows}
      metric={0}
      metricUp={true}
    />
  );
}