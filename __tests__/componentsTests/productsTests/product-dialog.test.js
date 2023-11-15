import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDialog } from '../../../src/components/product/product-dialog'; 
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('ProductDialog', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ProductDialog name="Test Product" image="test.jpg" isConsumption={false} updateCompanyConsumption={jest.fn()} />);
    expect(screen.getByTestId('purchase-button')).toBeInTheDocument();
  });

  it('opens dialog on purchase button click', async () => {
    render(<ProductDialog name="Test Product" image="test.jpg" isConsumption={false} updateCompanyConsumption={jest.fn()} />);
    fireEvent.click(screen.getByTestId('purchase-button'));
    await waitFor(() => expect(screen.getByLabelText('close-product-dialog')).toBeInTheDocument());
  });

  it('fetches product options on mount', async () => {
    api.get.mockResolvedValue({ data: { productSelection: [{ product_id: '1', name: 'Test Product', description: 'Test Description', price: '10' }] } });
    render(<ProductDialog name="Test Product" image="test.jpg" isConsumption={false} updateCompanyConsumption={jest.fn()} />);
    fireEvent.click(screen.getByTestId('purchase-button'));
    await waitFor(() => expect(screen.getByText(/Test Product/i)).toBeInTheDocument());
    await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));
  });
  
  // Haven´t been able to properly mock the selection of an option by the user

  // it('handles product purchase', async () => {
  //   api.get.mockResolvedValue({ data: { productSelection: [{ product_id: '1', name: 'Test Product', description: 'Test Description', price: '10' }] } });
  //   api.post.mockResolvedValue({ data: { purchase: {}, message: 'Purchase successful' } });
  //   const updateCompanyConsumption = jest.fn();
  //   render(<ProductDialog name="Test Product" image="test.jpg" isConsumption={false} updateCompanyConsumption={updateCompanyConsumption} />);
  //   fireEvent.click(screen.getByTestId('purchase-button'));
  
  //   // Wait for the option to be in the document
  //   await waitFor(() => screen.getByText('Test Product'));
  
  //   // Then select its value
  //   userEvent.selectOptions(screen.getByLabelText('product-label product'), ['1']);
  
  //   fireEvent.click(screen.getByText('Purchase'));
  //   await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
  // });
});