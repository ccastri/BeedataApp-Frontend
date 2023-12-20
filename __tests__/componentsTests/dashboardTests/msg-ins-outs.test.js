import React from 'react';
import { CompanyContext } from '../../../src/contexts/company';
import { AuthProvider } from '../../../src/contexts/auth';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MsgInsOuts } from '../../../src/components/dashboard/msg-ins-outs';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');
jest.mock('js-cookie');

describe('MsgInsOuts', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render data when API call succeeds', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        const mockData = { data: { success: true, messages: [] } };
        const mockToken = 'mockToken';
        api.get.mockResolvedValue(mockData);

        await act(async () => {
            render(
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyContext.Provider value={mockContextValue}>
                        <MsgInsOuts />
                    </CompanyContext.Provider>
                </AuthProvider>
            );
        });

        expect(api.get).toHaveBeenCalled();
    });

    it('should render loading state', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        const mockToken = 'mockToken';
        api.get.mockResolvedValue(new Promise(() => { })); // Promise that doesn't resolve to simulate loading

        await act(async () => {
            render(
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyContext.Provider value={mockContextValue}>
                        <MsgInsOuts />
                    </CompanyContext.Provider>
                </AuthProvider>
            );
        });

        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should render error message when API call fails', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        const mockToken = 'mockToken';
        const mockData = { data: { success: false, message: 'Error message' } };
        api.get.mockResolvedValue(mockData);

        await act(async () => {
            render(
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyContext.Provider value={mockContextValue}>
                        <MsgInsOuts />
                    </CompanyContext.Provider>
                </AuthProvider>
            );
        });

        await waitFor(() => expect(screen.getByText('Error message')).toBeInTheDocument());
    });

    it('should render "No data to display" when API returns no data', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        const mockToken = 'mockToken';
        const mockData = { data: { success: true, messages: [] } };
        api.get.mockResolvedValue(mockData);

        await act(async () => {
            render(
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyContext.Provider value={mockContextValue}>
                        <MsgInsOuts />
                    </CompanyContext.Provider>
                </AuthProvider>
            );
        });

        await waitFor(() => expect(screen.getByText('No data to display')).toBeInTheDocument());
    });

    it('should update start and end dates when date pickers change', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        const mockToken = 'mockToken';
        const mockData = { data: { success: true, messages: [] } };
        api.get.mockResolvedValue(mockData);

        await act(async () => {
            render(
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyContext.Provider value={mockContextValue}>
                        <MsgInsOuts />
                    </CompanyContext.Provider>
                </AuthProvider>
            );
        });

        const startDatePicker = screen.getByLabelText('Start Date');
        const endDatePicker = screen.getByLabelText('End Date');

        fireEvent.change(startDatePicker, { target: { value: '01/01/2022' } });
        fireEvent.change(endDatePicker, { target: { value: '31/01/2022' } });

        expect(startDatePicker.value).toBe('01/01/2022');
        expect(endDatePicker.value).toBe('31/01/2022');
    });
});