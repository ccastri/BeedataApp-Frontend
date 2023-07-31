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

});