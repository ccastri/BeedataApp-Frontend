import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductActivation } from '../../../../../src/components/product/product-settings/whatsapp-tabs/product-activation';
import api from '../../../../../src/lib/axios';

jest.mock('../../../../../src/lib/axios');

describe('ProductActivation', () => {
    it('renders the component without crashing', () => {
        render(<ProductActivation />);
    });

    it('disables the button when credit is less than or equal to 0', () => {
        render(<ProductActivation credit={0} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('opens the dialog when the button is clicked', () => {
        render(<ProductActivation />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls the onSubmit function when the Activate/Deactivate button in the dialog is clicked', async () => {
        const mockUpdateCompanyConsumption = jest.fn();
        const mockPurchaseConsumptionProduct = jest.fn();
        render(
            <ProductActivation
                isConsumption={false}
                credit={100}
                updateCompanyConsumption={mockUpdateCompanyConsumption}
                purchaseConsumptionProduct={mockPurchaseConsumptionProduct}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByLabelText('submit'));
        await waitFor(() => expect(mockUpdateCompanyConsumption).toHaveBeenCalled());
        expect(mockPurchaseConsumptionProduct).toHaveBeenCalled();
    });
});
