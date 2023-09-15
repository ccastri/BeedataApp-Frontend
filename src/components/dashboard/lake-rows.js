import { useState, useEffect } from 'react';
import { StatsCard } from './stats-cards';
import api from '../../lib/axios';


export const LakeRows = () => {
  const [rowCount, setRowCount] = useState(0);
  const [rowLimit, setRowLimit] = useState(0);

  const token = localStorage.getItem('jwt');

  useEffect(() => {
    const fetchRowLimit = async () => {
      try {
        const response = await api.get('/api/v1/purchases/active', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const { success, active } = response.data;
  
        if (success) {
          const purchasesWithRows = active.filter(purchase => purchase.db_rows_qty > 0);
  
          if (purchasesWithRows.length > 0) {
            const purchaseRowLimit = purchasesWithRows.reduce((prev, curr) => prev + curr.db_rows_qty, 0);
            setRowLimit(purchaseRowLimit);
            console.log('rowLimit', rowLimit);
          }
        } else {
          console.log(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchRowLimit();
  }, [token]);

  useEffect(() => {
    const fetchRowCount = async () => {
      try {
        const response = await api.get('/api/v1/lake/row-count-by-date', {
          headers: { 
            Authorization: `Bearer ${token}` 
          },
        });
        if (response.data.success) {
          setRowCount(response.data.rowCount);
        } else {
          console.log(response.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchRowCount();
  }, [token]);

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
      totalAmount={rowLimit}
    />
  );
}