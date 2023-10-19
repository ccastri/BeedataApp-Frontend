import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhonesTable } from '../../../../../src/components/product/product-settings/whatsapp-tabs/phones-table';
import api from '../../../../../src/lib/axios';

jest.mock('../../../../../src/lib/axios');

describe('PhonesTable', () => {

    const rows = [
        { id: 1, wabaId: 'WABA-123', phone: '+1234567890', status: 'Assigned', phoneId: 1 },
        { id: 2, wabaId: 'WABA-456', phone: '+0987654321', status: 'Unassigned', phoneId: 2 },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the table with the correct columns', () => {
        render(<PhonesTable rows={rows} />);
        const tableHeaders = screen.getAllByRole('columnheader');
        expect(tableHeaders).toHaveLength(3);
    });

    it('renders the table with the correct rows', () => {
        render(<PhonesTable rows={rows} />);
        const tableRows = screen.getAllByRole('row');
        expect(tableRows).toHaveLength(rows.length + 1); // +1 for the header row
        rows.forEach((row) => {
            expect(screen.getByText(row.wabaId)).toBeInTheDocument();
            expect(screen.getByText(row.phone)).toBeInTheDocument();
            expect(screen.getByText(row.status)).toBeInTheDocument();
        });
    });
});