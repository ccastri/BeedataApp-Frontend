import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '../../../src/components/product/product-card';
import * as utils from '../../../src/utils/get-user-role';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');
jest.mock('../../../src/utils/get-user-role', () => ({
  getUserRole: jest.fn(),
}));

describe('ProductCard', () => {
  beforeEach(() => {
    // Mock getUserRole to return 'admin'
    jest.spyOn(utils, 'getUserRole').mockReturnValue('admin');
    api.get.mockResolvedValue({
      data: {
        company: {
          access_token: 'access token',
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders product name', async () => {
    const product = {
      name: 'Test Product',
      image: 'test-image.png',
      id: 1
    };
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'days',
      beet_expiration_time: 30,
      create_date: '2022-01-01T00:00:00.000Z'
    };

    const wabas = [];

    const isActive = true;
    render(<ProductCard product={product} purchaseDetails={purchaseDetails} isActive={isActive} wabas={wabas} />);
    await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());
  });

  it('renders product image', () => {
    const product = {
      name: 'Test Product',
      image: 'test-image.png',
      id: 1
    };
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'days',
      beet_expiration_time: 30,
      create_date: '2022-01-01T00:00:00.000Z'
    };
    const isActive = true;
    render(<ProductCard product={product} purchaseDetails={purchaseDetails} isActive={isActive} wabas={[]} />);
    const productImage = screen.getByAltText('Product');
    expect(productImage).toBeInTheDocument();
  });


  it('renders product expiration date', () => {
    const product = {
      name: 'Test Product',
      image: 'test-image.png',
      id: 1
    };
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'days',
      beet_expiration_time: 30,
      create_date: '2022-01-01T00:00:00.000Z'
    };
    const isActive = true;
    render(<ProductCard product={product} purchaseDetails={purchaseDetails} isActive={isActive} wabas={[]} />);
    const expirationDate = screen.getByText(/Expires on:/i);
    expect(expirationDate).toBeInTheDocument();
  });

  it('renders product settings', () => {
    const product = {
      name: 'Test Product',
      image: 'test-image.png',
      id: 1
    };
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'days',
      beet_expiration_time: 30,
      create_date: '2022-01-01T00:00:00.000Z'
    };
    
    const isActive = true;
    const wabas = [];
    const updateWabas = jest.fn();
    const deleteRow = jest.fn();
    render(<ProductCard product={product} purchaseDetails={purchaseDetails} isActive={isActive} wabas={wabas} updateWabas={updateWabas} deleteRow={deleteRow} />);
    const productSettings = screen.getByTestId('settings-button');
    expect(productSettings).toBeInTheDocument();
  });

});
