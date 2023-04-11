import React from 'react';
import { render, screen } from '@testing-library/react';
import { PurchaseSummary } from '../../../src/components/payments/purchase-summary';
import axios from 'axios';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));


describe('PurchaseSummary', () => {
    test('renders no purchase history message', async () => {
      axios.get.mockResolvedValueOnce({ data: { purchaseHistory: [] } });
      render(<PurchaseSummary title="Purchase History" />);
      const message = await screen.findByText(/no purchase history found/i);
      expect(message).toBeInTheDocument();
    });
  
    test('renders purchase history table', async () => {
      const purchaseHistory = [
        {
          order_id: 1,
          create_date: '2022-01-01',
          name: 'Product 1',
          product_qty: 2,
          price_total: 20,
        },
        {
          order_id: 2,
          create_date: '2022-02-02',
          name: 'Product 2',
          product_qty: 3,
          price_total: 30,
        },
      ];
      axios.get.mockResolvedValueOnce({ data: { purchaseHistory } });
      render(<PurchaseSummary title="Purchase History" />);
      const table = await screen.findByRole('table');
      expect(table).toBeInTheDocument();
      expect(screen.getByText(/product 1/i)).toBeInTheDocument();
      expect(screen.getByText(/product 2/i)).toBeInTheDocument();
    });
  });
  