import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WhatsappSettings } from '../../../../src/components/product/product-settings/whatsapp';
import api from '../../../../src/lib/axios';

jest.mock('../../../../src/lib/axios');

describe('WhatsappSettings', () => {
    const mockDeleteRow = jest.fn();
    const mockUpdateCompanyConsumption = jest.fn();
    const mockClearMessages = jest.fn();

    const defaultProps = {
        wabas: [],
        deleteRow: mockDeleteRow,
        productId: 1,
        accessToken: true,
        isConsumption: true,
        credit: 100,
        responseMessage: 'Test message',
        errorMessage: 'Test error',
        updateCompanyConsumption: mockUpdateCompanyConsumption,
        clearMessages: mockClearMessages,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(<WhatsappSettings {...defaultProps} />);
    });

    it('renders SettingsDialog with correct props', () => {
        render(<WhatsappSettings {...defaultProps} />);
        fireEvent.click(screen.getByTestId('settings-button'));
        expect(screen.getByText('Test message')).toBeInTheDocument();
    });

});