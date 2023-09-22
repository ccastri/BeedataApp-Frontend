import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SocialAgents } from '../../../src/components/dashboard/social-agents';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('SocialAgents', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the component', async () => {
        const mockResponse = {
            data: {
                success: true,
                active: [
                    { agents_qty: 2 },
                    { agents_qty: 3 },
                    { agents_qty: 1 }
                ],
                agents: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ]
            }
        };
        api.get.mockResolvedValue(mockResponse);
        render(<SocialAgents />);
        await waitFor(() => expect(screen.getByText(/Social Agents/i)).toBeInTheDocument());
    });

    it('should fetch the active purchases', async () => {
        const mockResponse = {
            data: {
                success: true,
                active: [
                    { agents_qty: 2 },
                    { agents_qty: 5 },
                    { agents_qty: 1 }
                ],
                agents: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ]
            }
        };
        api.get.mockResolvedValue(mockResponse);
        render(<SocialAgents />);
        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/purchases/active', expect.any(Object)));
        await waitFor(() => expect(screen.getByText(/Agents limit: 8/i)).toBeInTheDocument());
    });

    it('should calculate the total social agents purchased', async () => {
        const mockResponse = {
            data: {
                success: true,
                active: [
                    { agents_qty: 2 },
                    { agents_qty: 3 },
                    { agents_qty: 1 }
                ],
                agents: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ]
            }
        };
        api.get.mockResolvedValue(mockResponse);
        render(<SocialAgents />);
        await waitFor(() => expect(screen.getByText(/Agents limit: 6/i)).toBeInTheDocument());
    });

    it('should fetch the social agents', async () => {
        const mockResponse = {
            data: {
                success: true,
                active: [
                    { agents_qty: 2 },
                    { agents_qty: 3 },
                    { agents_qty: 1 }
                ],
                agents: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ]
            }
        };
        api.get.mockResolvedValue(mockResponse);
        render(<SocialAgents />);
        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/social/agents', expect.any(Object)));
    });

    it('should display the number of social agents assigned', async () => {
        const mockResponse = {
            data: {
                success: true,
                active: [
                    { agents_qty: 2 },
                    { agents_qty: 3 },
                    { agents_qty: 1 }
                ],
                agents: [
                    { id: 1 },
                    { id: 2 },
                    { id: 3 }
                ]
            }
        }
        api.get.mockResolvedValue(mockResponse);
        render(<SocialAgents />);
        await waitFor(() => expect(screen.getByText('3')).toBeInTheDocument());
    });
});