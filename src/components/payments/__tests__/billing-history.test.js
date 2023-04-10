import React from 'react';
import axios from 'axios';
import { render, screen, act } from '@testing-library/react';
import { BillingHistory } from '../billing-history';

jest.mock('axios');

describe('BillingHistory', () => {
    const token = 'fake-token';

    beforeEach(() => {
      localStorage.setItem('jwt', token);
    });

    afterEach(() => {
      localStorage.removeItem('jwt');
      jest.clearAllMocks();
    });

    test('renders title', () => {
        render(<BillingHistory title="Billing History" />);
        const titleElement = screen.getByTestId("billing-history-title");
        expect(titleElement).toBeInTheDocument();
    });

    test('renders no billing history message when data is empty', async () => {

      axios.get.mockResolvedValueOnce({ data: { billingHistory: [] } });
    
      await act(async () => {
        render(<BillingHistory title="Billing History" />);
      });

      const messageElement = screen.getByText(/no billing history found/i);
      expect(messageElement).toBeInTheDocument();
    });

    test('renders billing history table when data is not empty', async () => {
      const mockData = [
        { id: 1, date: '2022-01-01', amount: 100 },
        { id: 2, date: '2022-02-01', amount: 200 },
      ];
      axios.get.mockResolvedValueOnce({ data: { billingHistory: mockData } });
  
      await act(async () => {
        render(<BillingHistory title="Billing History" />);
      });
  
      const tableElement = screen.getByTestId("billing-history-table");
      expect(tableElement).toBeInTheDocument();
    });

});