import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PhoneDeleteTable } from '../../../../../src/components/product/product-settings/whatsapp-tabs/phones-table-deletion';
import api from '../../../../../src/lib/axios';

jest.mock('../../../../../src/lib/axios');

describe('PhoneDeleteTable', () => {
    const rows = [
        { phoneId: 1, wabaId: 'waba1', phone: '1234567890', status: 'Assigned' },
        { phoneId: 2, wabaId: 'waba2', phone: '2345678901', status: 'Unassigned' },
        { phoneId: 3, wabaId: 'waba3', phone: '3456789012', status: 'Assigned' },
      ];
    
      const deleteRow = jest.fn();
    
      beforeEach(() => {
        api.delete.mockClear();
        deleteRow.mockClear();
      });

      it('should render the table with correct headers', () => {
        render(<PhoneDeleteTable rows={rows} deleteRow={deleteRow} />);
        expect(screen.getByText('Whatsapp Bussiness ID')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
      });

      it('should render the table with correct rows', () => {
        render(<PhoneDeleteTable rows={rows} deleteRow={deleteRow} />);
        expect(screen.getByText('waba1')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('waba2')).toBeInTheDocument();
        expect(screen.getByText('2345678901')).toBeInTheDocument();
        expect(screen.getByText('waba3')).toBeInTheDocument();
        expect(screen.getByText('3456789012')).toBeInTheDocument();
      });

      it('should select all rows when select all checkbox is clicked', () => {
        render(<PhoneDeleteTable rows={rows} deleteRow={deleteRow} />);
        const selectAllCheckbox = screen.getByLabelText('select all wabas');
        fireEvent.click(selectAllCheckbox);
        expect(selectAllCheckbox.checked).toBe(true);
        expect(screen.getAllByRole('checkbox', { checked: true }));
      });

      it('should delete selected rows when delete button is clicked', async () => {
        api.delete.mockResolvedValue({ data: { success: true } });
        render(<PhoneDeleteTable rows={rows} deleteRow={deleteRow} />);
        const selectAllCheckbox = screen.getByLabelText('select all wabas');
        fireEvent.click(selectAllCheckbox);
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        await waitFor(() => expect(api.delete).toHaveBeenCalled());
        expect(deleteRow).toHaveBeenCalled();
      });

      it('should not delete selected assigned rows when delete button is clicked', async () => {
        api.delete.mockResolvedValue({ data: { success: true } });
        render(<PhoneDeleteTable rows={rows} deleteRow={deleteRow} />);
        const selectAllCheckbox = screen.getByLabelText('select all wabas');
        fireEvent.click(selectAllCheckbox);
        const deleteButton = screen.getByLabelText('delete');
        fireEvent.click(deleteButton);
        await waitFor(() => expect(api.delete).toHaveBeenCalledTimes(1));
        expect(deleteRow).toHaveBeenCalledTimes(1);
      });
});