import React, { useEffect, useMemo, useState } from 'react';
import { WpGeneralContent } from './whatsapp-tabs/general';
import { SettingsDialog } from './settings-dialog';
import api from '../../../lib/axios';

const useSettingsState = (token) => {
  const [state, setState] = useState({
    accessToken: false,
    isConsumption: false,
    credit: 0,
    responseMessage: '',
    errorMessage: ''
  });

  const { accessToken, isConsumption, credit, responseMessage, errorMessage } = state;

  useEffect(() => {
    const fetchData = async () => {
      const [companyResponse] = await Promise.all([
        api.get('/api/v1/companies/company', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setState(prevState => ({
        ...prevState,
        accessToken: companyResponse.data.company.facebook_token ? true : false,
        isConsumption: companyResponse.data.company.credit_msg_consumption ? true : false,
        credit: parseFloat(companyResponse.data.company.credit),
      }));
    };
    fetchData();
  }, [token]);

  const updateCompanyConsumption = async (newStatus) => {
    try {
      const updateInfo = newStatus ? Date.now() : null;
      const updatedCompany = await api.put('/api/v1/companies/update-company', { creditMsgConsumption: updateInfo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (updatedCompany.data.success) {
        setState(prevState => ({ ...prevState, isConsumption: newStatus, credit: updatedCompany.data.company.credit, responseMessage: updatedCompany.data.message }));
      } else {
        setState(prevState => ({ ...prevState, errorMessage: updatedCompany.data.message }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
      }, 4000);
    }
  };

  const clearMessages = () => {
    setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
  };

  return { accessToken, isConsumption, credit, responseMessage, errorMessage, updateCompanyConsumption, clearMessages };
};

export const WhatsappSettings = ({ wabas, deleteRow, productId }) => {
  const token = localStorage.getItem('jwt');
  const { accessToken, isConsumption, credit, responseMessage, errorMessage, updateCompanyConsumption, clearMessages } = useSettingsState(token);

  const phoneRows = useMemo(() => wabas.map((waba, index) => ({
    id: index,
    phone: waba.phone_number,
    wabaId: waba.waba_id,
    phoneId: waba.phone_id,
    status: waba.department_id ? 'Assigned' : 'Unassigned',
  })), [wabas]);

  const purchaseConsumptionProduct = async () => {
    try {
      const productInfo = {
        productId: 4,
        productQuantity: 1,
      };

      await api.post('/api/v1/products/purchase-product', productInfo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    } catch (error) {
      console.log(error);
    }
  };

  const generalContent = <WpGeneralContent
    accessToken={accessToken}
    wabas={phoneRows}
    deleteRow={deleteRow}
    isConsumption={isConsumption}
    credit={credit}
    updateCompanyConsumption={updateCompanyConsumption}
    purchaseConsumptionProduct={purchaseConsumptionProduct}
    productId={productId}
  />;

  const tabs = [
    { label: 'General', content: generalContent },
  ];

  return (
    <>
      <SettingsDialog
        response={responseMessage}
        error={errorMessage}
        tabs={tabs}
        clearMessages={clearMessages}
      />
    </>
  )
};