import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MetricsContent } from '../../../../../src/components/product/product-settings/social-tabs/metrics';

describe('MetricsContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the MetricsContent component', async () => {
        await act(async () => {
            render(<MetricsContent agents={[]} />);
        });

        expect(screen.getByTestId('metrics')).toBeInTheDocument();
        expect(screen.getByTestId('rooms-chart')).toBeVisible();
        expect(screen.getByTestId('agents-rooms-table')).toBeVisible();
    });
});