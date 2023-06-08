import React from 'react';
import api from '../../../src/lib/axios';
import { render, screen, act } from '@testing-library/react';
import { BillingHistory } from '../../../src/components/payments/billing-history';

jest.mock('../../../src/lib/axios');

/*
Test suite for BillingHistory component

Test cases:
-  Renders title
-  Renders no billing history message when data is empty
-  Renders billing history table when data is not empty
*/

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

      api.get.mockResolvedValueOnce({ data: { billingHistory: [] } });
    
      await act(async () => {
        render(<BillingHistory title="Billing History" />);
      });

      const messageElement = screen.getByText(/no billing history found/i);
      expect(messageElement).toBeInTheDocument();
    });

    test('renders billing history table when data is not empty', async () => {
      const mockData = [
        { id: 1, create_date: '2022-01-01 3:00', amount: 100 },
        { id: 2, create_date: '2022-02-01 4:00', amount: 200 },
      ];
      api.get.mockResolvedValueOnce({ data: { billingHistory: mockData } });
  
      await act(async () => {
        render(<BillingHistory title="Billing History" />);
      });
  
      const tableElement = screen.getByTestId("billing-history-table");
      expect(tableElement).toBeInTheDocument();
    });

});