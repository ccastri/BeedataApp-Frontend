import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../../../src/components/product/product-card';
import { baseProducts } from '../../../src/data/base_products';

describe('ProductCard', () => {
  const product = {
    name: 'Beet / Bot (copia) (3 meses, 10)',
    name_short: 'Beet / Bot (copia) (3 meses, 10)',
    create_date: '2022-01-01T00:00:00.000Z',
  };

  it('renders the product name', () => {
    render(<ProductCard product={product} />);
    const productName = screen.getByText('Beet / Bot');
    expect(productName).toBeInTheDocument();
  });

  it('renders the product availability', () => {
    render(<ProductCard product={product} />);
    const productAvailability = screen.getByText('Available: 10 executions / month');
    expect(productAvailability).toBeInTheDocument();
  });

  it('calculates the product expiration date correctly', () => {
    render(<ProductCard product={product} />);
    const productExpiration = screen.getByText('Expires on: 31/3/2022');
    expect(productExpiration).toBeInTheDocument();
  });
});
