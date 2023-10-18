import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WhatsappSettings } from '../../../../src/components/product/product-settings/whatsapp';
import api from '../../../../src/lib/axios';

jest.mock('../../../../src/lib/axios');

describe('WhatsappSettings', () => {
    beforeEach(() => {
        api.get.mockClear(); // Clear mock calls before each test
        api.post.mockClear();
        api.delete.mockClear();
    });
    
    it('renders the component without errors', () => {
        render(<WhatsappSettings />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        expect(screen.getByTestId('permissions-title')).toBeInTheDocument();
    });

    it('displays the correct tab label', () => {
        render(<WhatsappSettings />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        expect(screen.getByText('General')).toBeInTheDocument();
    });

    it('calls the API to fetch company and wabas data', async () => {
        api.get.mockResolvedValueOnce({ data: { company: { facebook_token: 'token' } } });
        api.get.mockResolvedValueOnce({ data: { wabas: [] } });
        render(<WhatsappSettings />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });

        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
            headers: {
                Authorization: 'Bearer null',
            }
        }));
        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/whatsapp/business-account', {
            headers: {
                Authorization: 'Bearer null',
            }
        }));
    });

    it('displays the correct phone rows', async () => {
        const wabas = [
            { phone_number: '1234567890', waba_id: 'waba1', phone_id: 'phone1', department_id: 'dept1' },
            { phone_number: '0987654321', waba_id: 'waba2', phone_id: 'phone2', department_id: null },
        ];
        api.get.mockResolvedValueOnce({ data: { company: { facebook_token: 'token' } } });
        api.get.mockResolvedValueOnce({ data: { wabas } });
        render(<WhatsappSettings />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        await waitFor(() => {
            expect(screen.getByTestId('permissions-change')).toBeInTheDocument();
            expect(screen.getByTestId('phones-data')).toBeInTheDocument();
        });
    });
});