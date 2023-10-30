import React from 'react';
import { act, render, screen, fireEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { MetricsContent } from '../../../../../src/components/product/product-settings/social-tabs/metrics';

describe('MetricsContent', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the component without errors', () => {
        render(<MetricsContent agents={[]} />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
});