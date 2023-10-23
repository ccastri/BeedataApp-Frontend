import React, { useEffect, useState, useMemo } from 'react';
import { WpGeneralContent } from './whatsapp-tabs/general';
import { SettingsDialog } from './settings-dialog';
import api from '../../../lib/axios';


export const WhatsappSettings = ({ wabas, deleteRow }) => {
    const [state, setState] = useState({
        accessToken: false,
        responseMessage: '',
        errorMessage: ''
    });

    const { accessToken, responseMessage, errorMessage } = state;
    const token = localStorage.getItem('jwt');

    useEffect(() => {
        const fetchData = async () => {
            const [companyResponse] = await Promise.all([
                api.get('/api/v1/companies/company', { headers: { Authorization: `Bearer ${token}` } }),
            ]);
            setState(prevState => ({
                ...prevState,
                accessToken: companyResponse.data.company.facebook_token ? true : false,
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

    const generalContent = <WpGeneralContent
        accessToken={accessToken}
        wabas={phoneRows}
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