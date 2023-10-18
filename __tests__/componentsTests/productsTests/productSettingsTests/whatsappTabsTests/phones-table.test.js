import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhonesTable } from '../../../../../src/components/product/product-settings/whatsapp-tabs/phones-table';
import api from '../../../../../src/lib/axios';

jest.mock('../../../../../src/lib/axios');

describe('PhonesTable', () => {
    const columns = [
        { field: 'wabaId', headerName: 'Waba ID' },
        { field: 'phone', headerName: 'Phone' },
        { field: 'status', headerName: 'Status' },
        { field: 'disconnect', headerName: 'Disconnect' },
    ];

    const rows = [
        { id: 1, wabaId: 'WABA-123', phone: '+1234567890', status: 'Assigned', phoneId: 1 },
        { id: 2, wabaId: 'WABA-456', phone: '+0987654321', status: 'Unassigned', phoneId: 2 },
    ];

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the table with the correct columns', () => {
        render(<PhonesTable columns={columns} rows={rows} />);
        const tableHeaders = screen.getAllByRole('columnheader');
        expect(tableHeaders).toHaveLength(columns.length);
        columns.forEach((column) => {
            expect(screen.getByText(column.headerName)).toBeInTheDocument();
        });
    });

    it('renders the table with the correct rows', () => {
        render(<PhonesTable columns={columns} rows={rows} />);
        const tableRows = screen.getAllByRole('row');
        expect(tableRows).toHaveLength(rows.length + 1); // +1 for the header row
        rows.forEach((row) => {
            expect(screen.getByText(row.wabaId)).toBeInTheDocument();
            expect(screen.getByText(row.phone)).toBeInTheDocument();
            expect(screen.getByText(row.status)).toBeInTheDocument();
        });
    });

    it('displays the Disconnect button for assigned phones', () => {
        render(<PhonesTable columns={columns} rows={rows} />);
        const disconnectButtons = screen.getAllByRole('button', { name: 'disconnect' });
        expect(disconnectButtons).toHaveLength(1);
    });

    it('opens the Disconnect dialog when the Disconnect button is clicked', async () => {
        render(<PhonesTable columns={columns} rows={rows} />);
        const disconnectButton = screen.getByRole('button', { name: 'disconnect' });
        fireEvent.click(disconnectButton);
        await waitFor(() => {
            expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
        });
    });

    it('closes the Disconnect dialog when the Cancel button is clicked', async () => {
        render(<PhonesTable columns={columns} rows={rows} />);
        const disconnectButton = screen.getByRole('button', { name: 'disconnect' });
        fireEvent.click(disconnectButton);
        await waitFor(() => {
            expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
        });
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        await waitFor(() => {
            expect(screen.queryByText('Are You Sure?')).not.toBeInTheDocument();
        });
    });

    it('calls the API to disconnect the phone when the Disconnect button is clicked', async () => {
        const mockPut = jest.spyOn(api, 'put').mockResolvedValueOnce({ data: { success: true, message: 'Phone disconnected' } });
        const updateRowStatus = jest.fn();
        render(<PhonesTable columns={columns} rows={rows} updateRowStatus={updateRowStatus} />);
        const disconnectButton = screen.getByRole('button', { name: 'disconnect' });
        fireEvent.click(disconnectButton);
        await waitFor(() => {
            expect(screen.getByText('Are You Sure?')).toBeInTheDocument();
        });
        const confirmButton = screen.getByRole('button', { name: 'Disconnect' });
        fireEvent.click(confirmButton);
        await waitFor(() => {
            expect(mockPut).toHaveBeenCalledWith('/api/v1/whatsapp/business-account', {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` },
                data: { phoneNumberId: rows[0].phoneId, departmentId: null },
            });
            expect(updateRowStatus).toHaveBeenCalledWith(rows[0].phoneId);
            expect(screen.queryByText('Are You Sure?')).not.toBeInTheDocument();
            expect(screen.getByText('Phone disconnected')).toBeInTheDocument();
        });
    });
});