import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DepartmentsTable } from '../../../../../src/components/product/product-settings/social-tabs/department-table';

describe('DepartmentsTable', () => {
    const departmentRows = [
        {
          id: 1,
          department: 'Sales',
          phone: '+1234567890',
          status: 'Connected',
          phoneId: 1,
          phoneNumber: '+1234567890',
          departmentId: 1,
        },
        {
          id: 2,
          department: 'Support',
          phone: '+0987654321',
          status: 'Connected',
          phoneId: 2,
          phoneNumber: '+0987654321',
          departmentId: 2,
        },
      ];
    
      const handleDisconnect = jest.fn();
    
      beforeEach(() => {
        jest.clearAllMocks();
      });
    
      it('renders table headers correctly', () => {
        render(<DepartmentsTable departmentRows={departmentRows} handleDisconnect={handleDisconnect} />);
        expect(screen.getByText('Department')).toBeInTheDocument();
        expect(screen.getByText('Phone Number')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });

      it('renders department rows correctly', () => {
        render(<DepartmentsTable departmentRows={departmentRows} handleDisconnect={handleDisconnect} />);
        expect(screen.getByText(/Sales/i)).toBeInTheDocument();
        expect(screen.getByText(/1234567890/i)).toBeInTheDocument();
        expect(screen.getByText(/Support/i)).toBeInTheDocument();
        expect(screen.getByText(/0987654321/i)).toBeInTheDocument();
      });

      it('calls handleDisconnect on disconnect button confirmation', async () => {
        render(<DepartmentsTable departmentRows={departmentRows} handleDisconnect={handleDisconnect} />);
        const disconnectButton = screen.getByLabelText('disconnect-button-1');
        fireEvent.click(disconnectButton);
        const confirmButton = screen.getByTestId('disconnect-button-1');
        fireEvent.click(confirmButton);
        await waitFor(() => expect(handleDisconnect).toHaveBeenCalledTimes(1));
      });
});