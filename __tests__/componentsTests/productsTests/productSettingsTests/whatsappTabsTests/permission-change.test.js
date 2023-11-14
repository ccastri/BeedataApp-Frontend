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
    expect(screen.getByTestId('change-permissions-button')).toBeInTheDocument();
  });

  it('opens the dialog when the Permissions button is clicked', () => {
    render(<PermissionChange rows={rows} />);
    fireEvent.click(screen.getByTestId('change-permissions-button'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders the correct number of rows in the table', () => {
    render(<PermissionChange rows={rows} />);
    fireEvent.click(screen.getByTestId('change-permissions-button'));
    expect(screen.getAllByRole('row')).toHaveLength(1); // header row + 2 data rows
  });
});
