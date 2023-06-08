import React from 'react';
import api from '../../src/lib/axios';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import Page from '../../src/pages/products';

jest.mock('../../src/lib/axios');

describe('Products page', () => {
    test('renders loading spinner before fetching data', () => {
        const { getByRole } = render(<Page />);
        const spinner = getByRole('progressbar');
        expect(spinner).toBeInTheDocument();
    });

    test('gets products information', async () => {
        // mock data for api.get('/api/company-all-products')
        const mockResponse = {
            data: {
                products: [
                    {
                        beet_app_product: ['product1', 'product2'],
                        create_date: '2021-01-01',
                        beet_expiration_time: 10,
                        beet_renewal_time: 8,
                        beet_renewal_exp_unit: 'days',
                    },
                ],
            },
        };
        // mock api.get function with jest.fn()
        api.get.mockResolvedValue(mockResponse);

        const { getByText } = render(<Page />);
        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/company-all-products', { "headers": { "Authorization": "Bearer null" } }));
    });

});