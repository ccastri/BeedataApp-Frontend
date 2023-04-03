import React from 'react';
import axios from 'axios';
import { render, screen, act } from '@testing-library/react';
import { BillingHistory } from '../billing-history';


describe('BillingHistory', () => {
    test('renders title', () => {
        render(<BillingHistory title="Billing History" />);
        const titleElement = screen.getByTestId("billing-history-title");
        expect(titleElement).toBeInTheDocument();
    });

    test('renders no billing history message when data is empty', () => {
        jest.mock('axios', () => ({
          get: jest.fn(() => Promise.resolve({
            data: { billingHistory: [] },
          })),
        }));
    
        render(<BillingHistory title="Billing History" />);
        const messageElement = screen.getByText(/no billing history found/i);
        expect(messageElement).toBeInTheDocument();
      });

      test('renders billing history table when data is not empty', () => {});
});