import React from 'react';
import Cookies from 'js-cookie';
import CompanyContext from '../../../src/contexts/company-context';
import { render, screen, waitFor, act } from '@testing-library/react';
import { WhatsappMsg } from '../../../src/components/dashboard/whatsapp-msg';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('WhatsappMsg', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    // The function should fetch data from the API endpoint '/api/v1/{companyId}/social/messages' with the correct parameters and headers.
    it('should fetch data from the API endpoint with the correct parameters and headers', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
        const mockMessagesResponse = {
            data: {
                success: true,
                messages: [
                    {
                        data: {
                            total: [1, 2, 3]
                        }
                    },
                    {
                        data: {
                            total: [4, 5, 6]
                        }
                    }
                ]
            }
        };

        api.get.mockResolvedValueOnce(mockMessagesResponse);

        await act(async () => {
            render(
                <CompanyContext.Provider value={{ companyId: mockContextValue }}>
                    <WhatsappMsg isConsumption={true} msgLimit={10} />
                </CompanyContext.Provider>
            );
        });

        expect(api.get).toHaveBeenCalledWith(`/api/v1/${mockContextValue}/social/messages`, {
            headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
            params: { isConsumption: true, isRenewal: false }
        });
    });

    // If the API call is successful, the function should calculate the total number of messages consumed and set the state of 'msgCount' accordingly.
    it('should calculate the total number of messages consumed when the API call is successful', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
        const mockMessagesResponse = {
            data: {
                success: true,
                messages: [
                    {
                        data: {
                            total: [1, 2, 3]
                        }
                    },
                    {
                        data: {
                            total: [4, 5, 6]
                        }
                    }
                ]
            }
        };

        api.get.mockResolvedValueOnce(mockMessagesResponse);

        await act(async () => {
            render(
                <CompanyContext.Provider value={{ companyId: mockContextValue }}>
                    <WhatsappMsg isConsumption={true} msgLimit={10} />
                </CompanyContext.Provider>
            );
        });

        expect(screen.getByText(/6/i)).toBeInTheDocument();
    });

    it('should log an error to the console when the API call fails', async () => {
        const mockError = new Error('API call failed');
        const mockContextValue = { companyId: 'mockCompanyId' };

        api.get.mockRejectedValueOnce(mockError);

        console.error = jest.fn();

        await act(async () => {
            render(
                <CompanyContext.Provider value={{ companyId: mockContextValue }}>
                    <WhatsappMsg isConsumption={true} msgLimit={10} />
                </CompanyContext.Provider>
            );
        });

        expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it('should have the correct parameters in the API call when \'isConsumption\' is false and \'isRenewal\' is false', async () => {
        const mockContextValue = { companyId: 'mockCompanyId' };
        jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
        const mockMessagesResponse = {
            data: {
                success: true,
                messages: [
                    {
                        data: {
                            total: [1, 2, 3]
                        }
                    },
                    {
                        data: {
                            total: [4, 5, 6]
                        }
                    }
                ]
            }
        };

        api.get.mockResolvedValueOnce(mockMessagesResponse);

        await act(async () => {
            render(
                <CompanyContext.Provider value={{ companyId: mockContextValue }}>
                    <WhatsappMsg isConsumption={false} msgLimit={10} />
                </CompanyContext.Provider>
            );
        });

        expect(api.get).toHaveBeenCalledWith(`/api/v1/${mockContextValue}/social/messages`, {
            headers: { Authorization: `Bearer ${Cookies.get('jwt')}` },
            params: { isConsumption: false, isRenewal: true }
        });
    });

});