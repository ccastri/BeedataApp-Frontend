import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SocialSettings } from '../../../../src/components/product/product-settings/social';
import api from '../../../../src/lib/axios';

jest.mock('../../../../src/lib/axios');

describe('SocialSettings', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data on mount', async () => {
        api.get.mockResolvedValueOnce({
            data: {
                users: [],
                agents: [],
                departments: [],
                availableDepartments: [],
                availablePhoneNums: [],
            },
        });

        render(<SocialSettings />);

        expect(api.get).toHaveBeenCalledWith('/api/v1/users/users-group-by', expect.any(Object));
        expect(api.get).toHaveBeenCalledWith('/api/v1/social/agents', expect.any(Object));
        expect(api.get).toHaveBeenCalledWith('/api/v1/social/departments', expect.any(Object));
        expect(api.get).toHaveBeenCalledWith('/api/v1/social/available-departments', expect.any(Object));
        expect(api.get).toHaveBeenCalledWith('/api/v1/whatsapp/business-account', expect.any(Object));
    });

    it('should add an agent when form is submitted with valid data', async () => {
        api.post.mockResolvedValueOnce({
            data: {
                success: true,
                message: 'Agent added successfully',
                user: {
                    agent_id: '123',
                    name: 'John Doe',
                    role: 'agent',
                },
                department: {
                    department_id: '456',
                    department_name: 'Sales',
                },
            },
        });

        render(<SocialSettings />);
        act(() => {
            fireEvent.click(screen.getByTestId('settings-button'));
        });

        expect(screen.getByTestId('agents-config')).toBeInTheDocument();
        expect(screen.getByTestId('current-agents')).toBeInTheDocument();
        expect(screen.getByTestId('department-config')).toBeInTheDocument();
    });
});