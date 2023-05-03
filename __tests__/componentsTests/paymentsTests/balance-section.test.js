import React from 'react';
import api from '../../../src/lib/axios';
import { render, screen } from '@testing-library/react';
import { BalanceSection } from '../../../src/components/payments/balance-section';

jest.mock('../../../src/lib/axios');

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
        api.get.mockResolvedValue(mockBalanceResponse);
    
        render(<BalanceSection title="Test Title" />);
    
        const balanceElement = await screen.findByText(/Current Balance/i);
        const balanceValue = screen.getByText(/USD\$ 100/i);
        expect(balanceElement).toBeInTheDocument();
        expect(balanceValue).toBeInTheDocument();
      });
});