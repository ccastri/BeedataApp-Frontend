import React from 'react';
import api from '../../../src/lib/axios';
import { render, screen, act } from '@testing-library/react';
import { BillingPreferences } from '../../../src/components/payments/billing-preferences';

jest.mock('../../../src/lib/axios');

describe('BillingPreferences', () => {
  beforeEach(() => {
    localStorage.setItem('jwt', 'fakeJwt');
  });

  afterEach(() => {
    localStorage.removeItem('jwt');
  });

  test('displays billing info', async () => {
    const billingInfo = {
      billing_address: '123 Main St',
      city: 'San Francisco',
      country: 'USA',
      billing_email: 'test@test.com'
    };
    api.get.mockResolvedValue({ data: { billingInfo } });

    render(<BillingPreferences title="Billing Preferences" />);

    // Wait for the data to be fetched and displayed
    const billingAddress = await screen.findByText(billingInfo.billing_address);
    const location = await screen.findByText(`${billingInfo.city}, ${billingInfo.country}`);
    const email = await screen.findByText(billingInfo.billing_email);

    expect(billingAddress).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(email).toBeInTheDocument();
  });

  test('renders component with empty billing information', async () => {
    api.get.mockResolvedValueOnce({
      data: { billingInfo: [] },
    });
  
    await act(async () => {
        render(<BillingPreferences title="Billing Preferences" />);
      });
  
    expect(screen.getByText('Billing Preferences')).toBeInTheDocument();
    expect(screen.getByText('Billing Address')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Billing Email')).toBeInTheDocument();
  });
});
