import React, { createContext, useReducer, useEffect } from "react";


export const CompanyContext = createContext();

const companyReducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return { ...state, companyId: action.payload };
        case 'UNSET':
            return { ...state, companyId: null };
        default:
            throw new Error();
    }
}

export const CompanyProvider = ({ children }) => {
    const initialState = {
        companyId: typeof window !== 'undefined' ? window.localStorage.getItem('companyId') : null
    };

    const [state, dispatch] = useReducer(companyReducer, initialState);

    const set = (companyId) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('companyId', companyId);
        }
        dispatch({ type: 'SET', payload: companyId });
    }

    const unset = () => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('companyId');
        }
        dispatch({ type: 'UNSET' });
    }

    return (
        <CompanyContext.Provider value={{ companyId: state.companyId, set, unset }}>
            {children}
        </CompanyContext.Provider>
    );
}