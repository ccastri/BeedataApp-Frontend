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

  const product = {
    id: 2,
    name: 'Test Product',
    image: 'test-image.jpg',
    description: 'This is a test product',
  };

  it('renders the product name', async () => {
    render(<ProductCard product={product} isActive={true} />);
    await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());
    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
        headers: {
            Authorization: `Bearer ${null}`,
        },
    });
  });

  it('renders the product image', async () => {
    render(<ProductCard product={product} isActive={true} />);
    await waitFor(() => expect(screen.getByAltText('Product')).toBeInTheDocument());

    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
      headers: {
        Authorization: `Bearer ${null}`,
      },
    });
    
    const productImage = screen.getByAltText('Product');
    expect(productImage).toHaveAttribute('src', 'test-image.jpg');
  });

  it('renders the product availability when active', async () => {
    render(<ProductCard product={product} isActive={true} />);
    await waitFor(() => expect(screen.getByText(/Available/i)).toBeInTheDocument());

    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
      headers: {
        Authorization: `Bearer ${null}`,
      },
    });
    const productAvailability = screen.getByText(/Available/i);
    expect(productAvailability).toBeInTheDocument();
  });

  it('renders the product availability when inactive', async () => {
    render(<ProductCard product={product} isActive={false} />);
    await waitFor(() => expect(screen.getByText('Not available')).toBeInTheDocument());

    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
      headers: {
        Authorization: `Bearer ${null}`,
      },
    });
    
    const productAvailability = screen.getByText('Not available');
    expect(productAvailability).toBeInTheDocument();
  });

  it('renders the expiration date when active', async () => {
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'days',
      beet_expiration_time: 1,
      create_date: new Date().toISOString(),
    };
    render(<ProductCard product={product} isActive={true} purchaseDetails={purchaseDetails} />);
    await waitFor(() => expect(screen.getByText(/Expires on:/)).toBeInTheDocument());

    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
      headers: {
        Authorization: `Bearer ${null}`,
      },
    });
    const expirationDate = screen.getByText(/Expires on:/);
    expect(expirationDate).toBeInTheDocument();
  });

  it('does not render the expiration date when inactive', async () => {
    const purchaseDetails = {
      beet_renewal_time: 1,
      beet_renewal_exp_unit: 'day',
      beet_expiration_time: 1,
      create_date: new Date().toISOString(),
    };
  
    render(<ProductCard product={product} isActive={false} purchaseDetails={purchaseDetails} />);
    await waitFor(() => expect(screen.getByText(/Not available/)).toBeInTheDocument());
  
    expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
      headers: {
        Authorization: `Bearer ${null}`,
      },
    });
    
    const expirationDate = screen.queryByText(/Expires on:/);
    expect(expirationDate).not.toBeInTheDocument();
  });
});
