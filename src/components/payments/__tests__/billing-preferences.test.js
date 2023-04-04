import React from 'react';
import axios from 'axios';
import { render, screen, act } from '@testing-library/react';
import { BillingPreferences } from '../billing-preferences';

jest.mock('axios');

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
    axios.get.mockResolvedValue({ data: { billingInfo } });

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
    axios.get.mockResolvedValueOnce({
      data: { billingInfo: [] },
    });
  
    await act(async () => {
        render(<BillingPreferences title="Billing Preferences" />);
      });
  
    expect(screen.getByText('Billing Preferences')).toBeInTheDocument();
    expect(screen.getByText('Billing Address')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Billing Email')).toBeInTheDocument();

    expect(screen.getByText('No billing information found')).toBeInTheDocument();
    expect(screen.getByText('No location found')).toBeInTheDocument();
    expect(screen.getByText('No email found')).toBeInTheDocument();
  
  });
});
