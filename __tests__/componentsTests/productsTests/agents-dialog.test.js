import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SocialAgentSelection } from '../../../src/components/product/agents-dialog';
import { useFormik } from 'formik';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('SocialAgentSelection', () => {
  beforeEach(() => {
    api.get.mockClear(); // Clear mock calls before each test
    api.post.mockClear();
    api.delete.mockClear();
  });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('fetches users and agents data on component mount', async () => {
      render(<SocialAgentSelection />);
      expect(api.get).toHaveBeenCalledTimes(5);
      expect(api.get).toHaveBeenCalledWith('/api/v1/users/users-group-by', {
        headers: {
          Authorization: `Bearer null`, // Token will be null initially, assuming localStorage is empty
        },
      });
      expect(api.get).toHaveBeenCalledWith('/api/v1/social/agents', {
        headers: {
          Authorization: `Bearer null`,
        },
      });
    });

    it('fetches departments and checks if agents are allowed on component mount', async () => {
      render(<SocialAgentSelection />);
      expect(api.get).toHaveBeenCalledTimes(5);
      expect(api.get).toHaveBeenCalledWith('/api/v1/social/departments', {
        headers: {
          Authorization: `Bearer null`,
        },
      });
      expect(api.get).toHaveBeenCalledWith('/api/v1/companies/company', {
        headers: {
          Authorization: `Bearer null`,
        },
      });
    });

    test('renders SocialAgentSelection component', async () => {
        render(<SocialAgentSelection />);
        // Assertions
        const agentsButton = screen.getByRole('button', { name: 'Agents' });
        expect(agentsButton).toBeInTheDocument();

        act(() => {
            fireEvent.click(agentsButton);
        });

        const dialog = screen.getByRole('dialog');
        await waitFor(() => {
            expect(dialog).toBeInTheDocument();
        });

        const dialogTitle = screen.getByText('Assign Beet Social Agents');
        expect(dialogTitle).toBeInTheDocument();

      });
      

    test('displays "No agents assigned" message when no agents are assigned', () => {
        render(<SocialAgentSelection />);
        const agentsButton = screen.getByRole('button', { name: 'Agents' });
      
        fireEvent.click(agentsButton);
      
        // Mock the agents data
        jest.spyOn(React, 'useState').mockReturnValueOnce([[], jest.fn()]);
      
        const noAgentsMessage = screen.getByText('No agents assigned to departments.');
        expect(noAgentsMessage).toBeInTheDocument();
       
      });

      it('renders agents and departments in select dropdowns', async () => {
        const mockUsers = [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
        const mockAgents = [{ agent_id: 1, name: 'Agent 1', role: 'Role 1', department_name: 'Department 1', department_id: 1 }];
    
        api.get.mockResolvedValueOnce({ data: { users: mockUsers } });
        api.get.mockResolvedValueOnce({ data: { agents: mockAgents } });
        api.get.mockResolvedValueOnce({ data: { departments: [] } });
        api.get.mockResolvedValueOnce({ data: { company: { social_agents_qty: 10 } } });
    
        render(<SocialAgentSelection />);
      });

      it('adds an agent and department when submitted', async () => {
        const mockResponse = {
          success: true,
          message: 'Agent added successfully',
          user: { agent_id: 1, name: 'Agent 1', role: 'Role 1' },
          department: { department_id: 1, department_name: 'Department 1' },
        };
    
        api.post.mockResolvedValueOnce({ data: mockResponse });
    
        render(<SocialAgentSelection />);
        const agentsButton = screen.getByRole('button', { name: 'Agents' });
      
        act(() => {
          fireEvent.click(agentsButton);
        });
        
        // Simulate form input and submission
        act(() => {
          fireEvent.change(screen.getByLabelText('Agent'), { target: { value: '1' } });
          fireEvent.change(screen.getByLabelText('Department'), { target: { value: '1' } });
          fireEvent.click(screen.getByRole('button', { name: 'Assign' }));
        });
      });

      it('deletes an agent when delete button is clicked', async () => {
        const mockAgents = [{ agent_id: 1, name: 'Agent 1', role: 'Role 1', department_name: 'Department 1', department_id: 1 }];
    
        api.get.mockResolvedValueOnce({ data: { agents: mockAgents } });
        api.delete.mockResolvedValueOnce({ data: { success: true, message: 'Agent deleted successfully' } });
    
        render(<SocialAgentSelection />);
        const agentsButton = screen.getByRole('button', { name: 'Agents' });
      
        act(() => {
          fireEvent.click(agentsButton);
        });
        
        // Simulate delete button click
        fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
      });
});