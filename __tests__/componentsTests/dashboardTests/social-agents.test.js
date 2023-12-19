import React from 'react';
import Cookies from 'js-cookie';
import { CompanyContext } from '../../../src/contexts/company';
import { render, screen, waitFor, act } from '@testing-library/react';
import { SocialAgents } from '../../../src/components/dashboard/social-agents';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');


describe('SocialAgents', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should fetch the number of social agents assigned to the company successfully', async () => {
        // Mock
        const mockResponse1 = {
            data: {
                success: true,
                active: [{ agents_qty: 5 }]
            }
        };

        const mockResponse2 = {
            data: {
                success: true,
                agents: []
            }
        };

        const apiMock = jest.spyOn(api, 'get');
        apiMock.mockImplementation((url) => {
            switch (url) {
                case `/api/v1/1/purchases/active`:
                    return Promise.resolve(mockResponse1);
                case `/api/v1/1/social/agents`:
                    return Promise.resolve(mockResponse2);
                default:
                    return Promise.reject(new Error('not found'));
            }
        });

        // Render
        await act(async () => render(
            <CompanyContext.Provider value={{ companyId: 1 }}>
                <SocialAgents />
            </CompanyContext.Provider>
        ));

        await waitFor(() => {
            // Assert
            expect(screen.getByText(/Assigned/i)).toBeInTheDocument();
            expect(screen.getAllByText(/Agents/i)[0]).toBeInTheDocument();
            expect(screen.getByText(/0/i)).toBeInTheDocument();
            expect(screen.getByText(/Agents limit: 5/i)).toBeInTheDocument();
        });
    });

    // Displays the number of social agents assigned to the company
    it('should display the number of social agents assigned to the company', async () => {
        // Mock
        const mockResponse1 = {
            data: {
                success: true,
                active: [{ agents_qty: 5 }]
            }
        };

        const mockResponse2 = {
            data: {
                success: true,
                agents: []
            }
        };

        const apiMock = jest.spyOn(api, 'get');
        apiMock.mockImplementation((url) => {
            switch (url) {
                case `/api/v1/1/purchases/active`:
                    return Promise.resolve(mockResponse1);
                case `/api/v1/1/social/agents`:
                    return Promise.resolve(mockResponse2);
                default:
                    return Promise.reject(new Error('not found'));
            }
        });

        // Render
        await act(async () => render(
            <CompanyContext.Provider value={{ companyId: 1 }}>
                <SocialAgents />
            </CompanyContext.Provider>
        ));

        await waitFor(() => {
            // Assert
            expect(screen.getByText(/5/i)).toBeInTheDocument();
        });
    });
});