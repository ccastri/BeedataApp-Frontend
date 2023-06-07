import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import Payments from '../../src/pages/payments';

/*
Test suite for Payments page

test cases:
- renders BalanceSection component
- renders BillingPreferences component
- renders PurchaseSummary component
- renders BillingHistory component
*/

describe('Payments component', () => {
      test('renders BalanceSection component', () => {
        const { getByText } = render(<Payments />);
        expect(getByText('Balance Information')).toBeInTheDocument();
      });
    
      test('renders BillingPreferences component', () => {
        const { getByText } = render(<Payments />);
        expect(getByText('Billing Preferences')).toBeInTheDocument();
      });
    
      test('renders PurchaseSummary component', () => {
        const { getByText } = render(<Payments />);
        expect(getByText('Purchase Summary')).toBeInTheDocument();
      });
    
      test('renders BillingHistory component', () => {
        const { getByText } = render(<Payments />);
        expect(getByText('Billing History')).toBeInTheDocument();
      });
});