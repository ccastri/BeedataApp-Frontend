import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SettingsDialog } from './settings-dialog';


export const LakeSettings = () => {
    const [state, setState] = useState({
        responseMessage: '',
        errorMessage: ''
    });

    const { responseMessage, errorMessage } = state;

    const tabs = [
        { label: 'General', content: <div></div> }
    ];
    
    const clearMessages = () => {
        setState(prevState => ({ ...prevState, responseMessage: '', errorMessage: '' }));
    };

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