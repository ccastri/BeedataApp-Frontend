import React from 'react';
import api from '../../../src/lib/axios';
import * as utils from '../../../src/utils/get-user-role';
import { render, screen, act } from '@testing-library/react';
import { BalanceSection } from '../../../src/components/payments/balance-section';

jest.mock('../../../src/lib/axios');
jest.mock('../../../src/utils/get-user-role', () => ({
  getUserRole: jest.fn(),
}));

/*
Test suite for the BalanceSection component

test cases:
- displays the add credit dialog for admins
- does not display the add credit dialog for non-admins
*/

describe('BalanceSection', () => {
  beforeEach(() => {
    // Mock getUserRole to return 'admin'
    jest.spyOn(utils, 'getUserRole').mockReturnValue('admin');
    api.get.mockResolvedValue({
      data: {
        company: {
          credit: 200,
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays the add credit dialog for admins', async () => {
    await act(async () => {
        render(<BalanceSection title="My Balance" />);
    });
    expect(screen.getByText('Add Credit')).toBeInTheDocument();
  });

  test('does not display the add credit dialog for non-admins', async () => {
    // Mock getUserRole to return 'user'
    jest.spyOn(utils, 'getUserRole').mockReturnValue('user');

    await act(async () => {
        render(<BalanceSection title="My Balance" />);
    });
    expect(screen.queryByText('Add Credit')).not.toBeInTheDocument();
  });
});
