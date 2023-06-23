import React from 'react';
import api from '../../../src/lib/axios';
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import { WpConfigAccountDialog } from '../../../src/components/product/config-account-dialog';

jest.mock('../../../src/lib/axios');

/*
Test suite for WpConfigAccountDialog component

Test cases:
- should display the dialog when clicking the configure button
- should close the dialog when clicking the close button
- should display account ID and access token fields
- should call onSubmit handler when Save Settings button is clicked
- should display success message when response is successful
*/

describe('WpConfigAccountDialog', () => {
    afterEach(() => {
        jest.resetAllMocks();
        localStorage.clear();
    });

    test('should display the dialog when clicking the configure button', async () => {
        render(<WpConfigAccountDialog />);
        const button = screen.getByText('Configure Account');
        expect(button).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(button);
        });

        const dialogTitle = screen.getByText('Configure WhatsApp Business Account');
        expect(dialogTitle).toBeInTheDocument();
    });

    test('should close the dialog when clicking the close button', async () => {
        render(<WpConfigAccountDialog />);
        const button = screen.getByText('Configure Account');
        expect(button).toBeInTheDocument();

        fireEvent.click(button);

        const closeButton = screen.getByRole('button', { name: 'close' });
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton);

        await waitFor(() => {
            const dialog = screen.queryByText('Configure WhatsApp Business Account');
            expect(dialog).not.toBeInTheDocument();
        });
    });

    test('should display account ID and access token fields', () => {
        render(<WpConfigAccountDialog />);
        const button = screen.getByText('Configure Account');
        fireEvent.click(button);

        const accountIdField = screen.getByLabelText('Account ID');
        const accessTokenField = screen.getByLabelText('Access Token');
        
        expect(accountIdField).toBeInTheDocument();
        expect(accessTokenField).toBeInTheDocument();
    });

    test('should call onSubmit handler when Save Settings button is clicked', async () => {
        render(<WpConfigAccountDialog />);
        const button = screen.getByText('Configure Account');
        expect(button).toBeInTheDocument();
      
        fireEvent.click(button);
      
        const accountIdField = screen.getByLabelText('Account ID');
        const accessTokenField = screen.getByLabelText('Access Token');
        const saveButton = screen.getByText('Save Settings');
        
        fireEvent.change(accountIdField, { target: { value: 'abc123' } });
        fireEvent.change(accessTokenField, { target: { value: 'def456' } });
      
        await act(async () => {
          fireEvent.click(saveButton);
        });
      
        const requestData = {
          waba_id: 'abc123',
          access_token: 'def456',
        };
        expect(api.post).toHaveBeenCalledWith('/api/v1/companies/update-company', requestData, expect.any(Object));
    });
    
    test('should display success message when response is successful', async () => {
        const responseMessage = 'Success!';
        jest.spyOn(api, 'post').mockResolvedValue({
          data: { company: {}, message: responseMessage }
        });
      
        render(<WpConfigAccountDialog />);
        const button = screen.getByText('Configure Account');
        expect(button).toBeInTheDocument();
      
        fireEvent.click(button);
      
        const accountIdField = screen.getByLabelText('Account ID');
        const accessTokenField = screen.getByLabelText('Access Token');
        const saveButton = screen.getByText('Save Settings');
      
        fireEvent.change(accountIdField, { target: { value: 'abc123' } });
        fireEvent.change(accessTokenField, { target: { value: 'def456' } });
      
        await act(async () => {
          fireEvent.click(saveButton);
        });
      
        const successMessage = screen.getByText(responseMessage);
        expect(successMessage).toBeInTheDocument();
    });

});