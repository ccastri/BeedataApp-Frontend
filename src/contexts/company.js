import React, { createContext, useState } from "react";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
    const [companyId, setCompanyId] = useState(null);

    return (
        <CompanyContext.Provider value={{ companyId, setCompanyId }}>
            {children}
        </CompanyContext.Provider>
    );
}
