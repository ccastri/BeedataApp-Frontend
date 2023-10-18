import React, { useEffect, useState, useMemo } from 'react';
import { WpGeneralContent } from './whatsapp-tabs/general';
import { SettingsDialog } from './settings-dialog';
import api from '../../../lib/axios';


export const WhatsappSettings = () => {
    const [state, setState] = useState({
        accessToken: false,
        wabas: [],
        responseMessage: '',
        errorMessage: ''
    });

    const { accessToken, wabas, responseMessage, errorMessage } = state;
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchData = async () => {
            const [companyResponse, wabasResponse] = await Promise.all([
                api.get('/api/v1/companies/company', { headers: { Authorization: `Bearer ${token}` } }),
                api.get('/api/v1/whatsapp/business-account', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setState(prevState => ({
                ...prevState,
                accessToken: companyResponse.data.company.facebook_token ? true : false,
                wabas: wabasResponse.data.wabas,
            }));
        };
        fetchData();
    }, [token]);

    const phoneRows = useMemo(() => wabas.map((waba, index) => ({
        id: index,
        phone: waba.phone_number,
        wabaId: waba.waba_id,
        phoneId: waba.phone_id,
        status: waba.department_id ? 'Assigned' : 'Unassigned',
    })), [wabas]);

    const clearMessages = () => {
        setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
    };

    const updateRowStatus = (phoneId) => {
        setState(prevState => {
            const updatedWabas = prevState.wabas.map(waba => {
                if (waba.phone_id === phoneId) {
                    return { ...waba, department_id: null };
                }
                return waba;
            });
            return { ...prevState, wabas: updatedWabas };
        });
    };

    const deleteRow = (phoneId) => {
        setState(prevState => {
            const updatedWabas = prevState.wabas.filter(waba => waba.phone_id !== phoneId);
            return { ...prevState, wabas: updatedWabas };
        });
    };

    const generalContent = <WpGeneralContent
        accessToken={accessToken}
        wabas={phoneRows}
        updateRowStatus={updateRowStatus}
        deleteRow={deleteRow}
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