import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductDialog } from '../../../src/components/product/product-dialog'; 
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('ProductDialog', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    
  it('renders dialog', () => {
    render(<ProductDialog name="Product 1" description="Description of Product 1" image="path/to/image.png" />);
    const purchaseButton = screen.getByText('Purchase');
    fireEvent.click(purchaseButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
    
//   it('fetches product options on mount', async () => {
//     const mockProductOptions = [{
//       product_id: 1,
//       name: 'Product 1',
//       description: 'Description of Product 1',
//       product_alert: 10,
//     }, {
//       product_id: 2,
//       name: 'Product 2',
//       description: 'Description of Product 2',
//       product_alert: 20,
//     }];
//     api.post.mockResolvedValueOnce({ data: { productSelection: mockProductOptions } });
//     render(<ProductDialog name="Product 1" description="Description of Product 1" image="path/to/image.png" />);
//     await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/v1/products/beet-products', {
//         beetProduct: 'Product 1'
//     }, {
//         headers: {
//             Authorization: `Bearer ${null}`,
//         },
//     }));

    
//   });

  
});