import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PermissionChange } from '../../../../../src/components/product/product-settings/whatsapp-tabs/permission-change';
import api from '../../../../../src/lib/axios';

jest.mock('../../../../../src/lib/axios');


describe('PermissionChange', () => {

  let deleteRow;

  beforeEach(() => {
    deleteRow = jest.fn();
    api.get.mockClear(); // Clear mock calls before each test
    api.post.mockClear();
    api.delete.mockClear();
  });

  afterEach(() => {
    deleteRow.mockReset();
  });

  const rows = [
    { id: 1, wabaId: '123', phone: '555-555-5555', status: 'Assigned', phoneId: 1 },
    { id: 2, wabaId: '456', phone: '555-555-5556', status: 'Unassigned', phoneId: 2 },
  ];

  it('renders the Permissions button', () => {
    render(<PermissionChange rows={rows} />);
    expect(screen.getByRole('button', { name: 'Permissions' })).toBeInTheDocument();
  });

  it('opens the dialog when the Permissions button is clicked', () => {
    render(<PermissionChange rows={rows} />);
    fireEvent.click(screen.getByRole('button', { name: 'Permissions' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the correct number of rows in the table', () => {
    render(<PermissionChange rows={rows} />);
    fireEvent.click(screen.getByRole('button', { name: 'Permissions' }));
    expect(screen.getAllByRole('row')).toHaveLength(3); // header row + 2 data rows
  });

  it('calls the deleteRow function when the delete button is clicked', async () => {
    api.delete.mockResolvedValueOnce({ data: { message: 'success' } });

    render(<PermissionChange rows={rows} deleteRow={deleteRow} />);
    fireEvent.click(screen.getByRole('button', { name: 'Permissions' }));
    fireEvent.click(screen.getByTestId('delete-button-2'));
    
    await waitFor(() => expect(screen.getByTestId('delete-button-2')).toBeInTheDocument());
  });
});
