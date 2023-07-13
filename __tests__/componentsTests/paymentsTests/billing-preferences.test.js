import React from 'react';
import api from '../../../src/lib/axios';
import { render, screen, act } from '@testing-library/react';
import { BillingPreferences } from '../../../src/components/payments/billing-preferences';

jest.mock('../../../src/lib/axios');

/*
Test suite for BillingPreferences component

Test cases:
- Renders billing preferences correctly
*/

describe('BillingPreferences', () => {
  beforeEach(() => {
    localStorage.setItem('jwt', 'test_token');
  });

  afterEach(() => {
    localStorage.removeItem('jwt');
    jest.clearAllMocks();
  });

  test('render billing preferences correctly', async () => {
    api.get.mockImplementation((url, config) => {
      if (url === '/api/v1/users/user') {
        return Promise.resolve({
          data: {
            user: {
              city: 'test_city',
              country: 'test_country',
            },
          },
        });
      } else if (url === '/api/v1/companies/company') {
        return Promise.resolve({
          data: {
            company: {
              billing_address: 'test_billing_address',
              billing_email: 'test_billing_email',
            },
          },
        });
      }
    });

    await act(async () => {
      render(<BillingPreferences title="Billing Preferences" />);
    });

    expect(screen.getByText('Billing Address')).toBeInTheDocument();
    expect(screen.getByText('test_billing_address')).toBeInTheDocument();

    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('test_city, test_country')).toBeInTheDocument();

    expect(screen.getByText('Billing Email')).toBeInTheDocument();
    expect(screen.getByText('test_billing_email')).toBeInTheDocument();
  });
});
