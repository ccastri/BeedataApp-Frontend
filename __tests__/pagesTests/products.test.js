import React from 'react';
import api from '../../src/lib/axios';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import Page from '../../src/pages/products';

jest.mock('../../src/lib/axios');

describe('Products page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', async () => {
    api.get.mockResolvedValue({ data: {} });
    render(<Page />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render products after loading', async () => {
    const mockData = {
      products: [],
      wabas: [],
      company: {
        credit_msg_consumption: false,
        facebook_token: false,
        credit: 0,
      },
    };
  
    api.get.mockResolvedValueOnce({ data: { products: mockData.products } })
      .mockResolvedValueOnce({ data: { wabas: mockData.wabas } })
      .mockResolvedValueOnce({ data: { company: mockData.company } });
  
    api.put.mockResolvedValue({ data: { success: true, company: { credit: 0 }, message: '' } });
  
    render(<Page />);
    await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument());
  
    mockData.products.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

});