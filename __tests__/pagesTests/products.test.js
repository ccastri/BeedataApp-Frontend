import React from 'react';
import api from '../../src/lib/axios';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import Page from '../../src/pages/products';

jest.mock('../../src/lib/axios');

describe('Products page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
      });
    
      it('should render loading spinner when data is being fetched', async () => {
        api.get.mockResolvedValueOnce({ data: { products: [] } });
        render(<Page />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
      });

      it('should render product cards when data is fetched', async () => {
        api.get.mockResolvedValueOnce({ data: { products: [] } });
        api.get.mockResolvedValueOnce({ data: { wabas: [] } });
        render(<Page />);
        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
        expect(screen.getAllByTestId('product-avatar'));
      });
});