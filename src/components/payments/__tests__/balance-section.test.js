import React from 'react';
import axios from 'axios';
import { render, screen, fireEvent } from '@testing-library/react';
import { BalanceSection } from '../balance-section';

jest.mock('axios');

describe('BalanceSection', () => {
    beforeEach (() => {
        localStorage.setItem('jwt', 'test-token');
    });

    afterEach (() => {
        localStorage.clear();
    });

    it('should render the current balance', async () => {
        const mockBalanceResponse = {
          data: {
            currentBalance: 100,
          },
        };
        axios.get.mockResolvedValue(mockBalanceResponse);
    
        render(<BalanceSection title="Test Title" />);
    
        const balanceElement = await screen.findByText(/Current Balance/i);
        const balanceValue = screen.getByText(/USD\$ 100/i);
        expect(balanceElement).toBeInTheDocument();
        expect(balanceValue).toBeInTheDocument();
      });

    //   it('should set isAlertEnabled state when alert switch is toggled', async () => {
    //     const mockBalanceResponse = {
    //       data: {
    //         currentBalance: 100,
    //       },
    //     };
    //     axios.get.mockResolvedValue(mockBalanceResponse);
    
    //     const mockAlertStateResponse = {
    //       data: {
    //         alertState: [{ alert_switch: true }],
    //       },
    //     };
    //     axios.get.mockResolvedValue(mockAlertStateResponse);
    
    //     const mockAlertChangeResponse = {
    //       data: {},
    //     };
    //     axios.post.mockResolvedValue(mockAlertChangeResponse);
    
    //     render(<BalanceSection title="Test Title" />);

    //       // Find the alert switch and simulate a click
    //     const alertSwitch = screen.getByTestId('alert-switch');
    //     fireEvent.click(alertSwitch);

    //     // Wait for the state to update
    //     await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    //     // Check that the state was updated correctly
    //     expect(axios.post).toHaveBeenCalledWith('/api/set-alert', {
    //         alert_switch: false
    //     }, expect.any(Object));
    //     expect(screen.getByTestId('alert-switch')).not.toBeChecked();
    //     expect(screen.getByTestId('alert-switch')).toHaveAttribute('aria-checked', 'false');

    // });

});