import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AgentsTable } from '../../../../../src/components/product/product-settings/social-tabs/agents-table';

jest.mock('../../../../../src/lib/axios');

describe('AgentsTable', () => {
    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'role', headerName: 'Role', width: 200 },
        { field: 'department', headerName: 'Department', width: 200 },
    ];

    const rows = [
        { id: 1, name: 'John Doe', role: 'Manager', department: 'Sales' },
        { id: 2, name: 'Jane Smith', role: 'Supervisor', department: 'Marketing' },
    ];

    const onDeleteRow = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the table with the correct columns', () => {
        render(<AgentsTable columns={columns} rows={rows} onDeleteRow={onDeleteRow} />);
        const nameColumn = screen.getByText('Name');
        const roleColumn = screen.getByText('Role');
        const departmentColumn = screen.getByText('Department');
        expect(nameColumn).toBeInTheDocument();
        expect(roleColumn).toBeInTheDocument();
        expect(departmentColumn).toBeInTheDocument();
    });

    it('renders the table with the correct rows', () => {
        render(<AgentsTable columns={columns} rows={rows} onDeleteRow={onDeleteRow} />);
        const johnDoeRow = screen.getByText('John Doe');
        const janeSmithRow = screen.getByText('Jane Smith');
        expect(johnDoeRow).toBeInTheDocument();
        expect(janeSmithRow).toBeInTheDocument();
    });

    it('calls onDeleteRow when delete button is clicked', () => {
        render(<AgentsTable columns={columns} rows={rows} onDeleteRow={onDeleteRow} />);
        const deleteButton = screen.getAllByRole('button')[0];
        fireEvent.click(deleteButton);
        expect(onDeleteRow).toHaveBeenCalledTimes(1);
        expect(onDeleteRow).toHaveBeenCalledWith(rows[0]);
    });

    it('displays the delete button for each row', () => {
        render(<AgentsTable columns={columns} rows={rows} onDeleteRow={onDeleteRow} />);
        const deleteButtons = screen.getAllByLabelText('delete');
        expect(deleteButtons).toHaveLength(rows.length);
    });
});