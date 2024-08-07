import React, { useMemo, useContext } from 'react';
import { WpGeneralContent } from './whatsapp-tabs/general';
import { SettingsDialog } from './settings-dialog';
import { CompanyContext } from '../../../contexts/company';
import { AuthContext } from '../../../contexts/auth';
import PropTypes from 'prop-types';
import api from '../../../lib/axios';


export const WhatsappSettings = ({ wabas, deleteRow, productId, accessToken, isConsumption, credit, responseMessage, errorMessage, updateCompanyConsumption, updateWabas, clearMessages }) => {
  const { companyId } = useContext(CompanyContext);
  const { token } = useContext(AuthContext);

  const phoneRows = useMemo(() => wabas.map((waba, index) => ({
    id: index,
    phone: waba.phone_number,
    wabaId: waba.waba_id,
    phoneId: waba.phone_id,
    status: waba.cw_inbox_id ? 'Assigned' : 'Unassigned',
  })), [wabas]);

  const purchaseConsumptionProduct = async () => {
    try {
      const productId = 4;  

      await api.post(`/api/v1/${companyId}/products/${productId}`, {
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
    updateWabas={updateWabas}
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

WhatsappSettings.propTypes = {
  wabas: PropTypes.array,
  deleteRow: PropTypes.func,
  productId: PropTypes.number,
  accessToken: PropTypes.bool,
  isConsumption: PropTypes.bool,
  credit: PropTypes.number,
  responseMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  updateCompanyConsumption: PropTypes.func,
  updateWabas: PropTypes.func,
  clearMessages: PropTypes.func,
};