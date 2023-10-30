import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SocialSettings } from '../../../../src/components/product/product-settings/social';
import api from '../../../../src/lib/axios';

jest.mock('../../../../src/lib/axios');

describe('SocialSettings', () => {
    beforeEach(() => {
    });
    
    it('should render the component without errors', () => {
        render(<SocialSettings wabas={[]} />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        expect(screen.getByText('General')).toBeInTheDocument();
        expect(screen.getByText('Metrics')).toBeInTheDocument();
    });

    it('should call handleAgentsDelete function when delete button is clicked', async () => {
        render(<SocialSettings wabas={[]} />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        const deleteButton = screen.getByRole('button', { name: /delete/i });
        expect(deleteButton).toBeInTheDocument();
      });

      it('should call handleDisconnect function when disconnect button is clicked', async () => {
        const wabas = [{ phone_id: 1, phone_number: '+1234567890', department_id: 1 }];
        render(<SocialSettings wabas={wabas} />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });
        const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
        expect(disconnectButton).toBeInTheDocument();
      });
});