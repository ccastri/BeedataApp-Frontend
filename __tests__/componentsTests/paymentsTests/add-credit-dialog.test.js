import React from 'react';
import api from '../../../src/lib/axios';
import { render, fireEvent, screen, act, waitFor} from '@testing-library/react';
import { CreditDialog } from '../../../src/components/payments/add-credit-dialog';

jest.mock('../../../src/lib/axios');

/*
Test suite for the CreditDialog component.

test cases:
- renders the "Add Credit" button
- opens the dialog when "Add Credit" button is clicked
- closes the dialog when "Cancel" button is clicked
- submits the form when "Add Credit" button is clicked and request is successful
*/
describe('CreditDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the "Add Credit" button', () => {
    render(<CreditDialog />);
    expect(screen.getByRole('button', { name: /add credit/i })).toBeInTheDocument();
  });

  test('opens the dialog when "Add Credit" button is clicked', async () => {
    render(<CreditDialog />);
    const button = screen.getByRole('button', { name: /add credit/i });
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('closes the dialog when "Cancel" button is clicked', async () => {
    render(<CreditDialog />);
    const addButton = screen.getByRole('button', { name: /add credit/i });
    fireEvent.click(addButton);
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByText(/Add credit to your account/i)).not.toBeInTheDocument();
    });
  });

  test('submits the form when "Add Credit" button is clicked and request is successful', async () => {
    api.post.mockResolvedValueOnce({ data: { success: true, message: '' } });
    render(<CreditDialog />);
    const button = screen.getByRole('button', { name: /add credit/i });
    fireEvent.click(button);
    const input = screen.getByLabelText(/amount \$usd/i);
    fireEvent.change(input, { target: { value: '50' } });
    const submitButton = screen.getByRole('button', { name: /add credit/i });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/credit will be invoiced/)).toBeInTheDocument();
    });
    expect(api.post).toHaveBeenCalledTimes(1);
    expect(api.post).toHaveBeenCalledWith('/api/v1/products/purchase-product', { productId: 50, productQuantity: '50' }, { headers: { Authorization: 'Bearer null' } });
  });
});
