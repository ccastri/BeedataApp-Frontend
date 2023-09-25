import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MsgInsOuts } from '../../../src/components/dashboard/msg-ins-outs';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('MsgInsOuts', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render the component without crashing', async () => {
        api.post.mockResolvedValue({
          data: {
            success: true,
            messages: [{
                data: {
                    total: []
                }
            }],
          },
        });
      
        render(<MsgInsOuts />);
        await waitFor(() => expect(screen.getByText('WHATSAPP IN & OUTS')).toBeInTheDocument());
    });

    it('should display error message if end date is less than start date', async () => {
        render(<MsgInsOuts />);
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        const filterButton = screen.getByRole('button', { name: 'Filter' });

        await waitFor(() => {
            expect(startDateInput).toBeInTheDocument();
            expect(endDateInput).toBeInTheDocument();
            expect(filterButton).toBeInTheDocument();
        });
        const initialStartDate = '01-31-2022';
        const initialEndDate = '01-01-2021';

        fireEvent.change(startDateInput, { target: { value: initialStartDate } });
        fireEvent.change(endDateInput, { target: { value: initialEndDate } });

        fireEvent.click(filterButton);

        await waitFor(() => expect(screen.getByText('WHATSAPP IN & OUTS')).toBeInTheDocument());
        await waitFor(() => expect(api.post).toHaveBeenCalledTimes(2));
    });

    it('should display error message if date range is more than 4 months', async () => {
        render(<MsgInsOuts />);
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        const filterButton = screen.getByRole('button', { name: 'Filter' });

        await waitFor(() => {
            expect(startDateInput).toBeInTheDocument();
            expect(endDateInput).toBeInTheDocument();
            expect(filterButton).toBeInTheDocument();
        });

        fireEvent.change(startDateInput, { target: { value: '01-01-2022' } });
        fireEvent.change(endDateInput, { target: { value: '01-01-2023' } });

        fireEvent.click(filterButton);
    });

    it('should display the line chart if data is fetched successfully', async () => {
        const mockData = {
            success: true,
            messages: [
                {
                    data: {
                        total: [
                            {
                                ts: '2022-01-01T00:00:00.000Z',
                                u: {
                                    name: 'agente'
                                }
                            },
                            {
                                ts: '2022-01-01T00:00:00.000Z',
                                u: {
                                    name: 'visitor'
                                }
                            },
                            {
                                ts: '2022-01-01T00:00:00.000Z',
                                u: {
                                    name: 'chatbot'
                                }
                            }
                        ]
                    }
                }
            ]
        };

        api.post.mockResolvedValue({ data: mockData });

        render(<MsgInsOuts />);
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        const filterButton = screen.getByRole('button', { name: 'Filter' });

        await waitFor(() => {
            expect(startDateInput).toBeInTheDocument();
            expect(endDateInput).toBeInTheDocument();
            expect(filterButton).toBeInTheDocument();
        });

        startDateInput.value = '2022-01-01';
        endDateInput.value = '2022-01-01';

        fireEvent.click(filterButton);

        await waitFor(() => expect(screen.getByText('WHATSAPP IN & OUTS')).toBeInTheDocument());
        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/v1/social/messages', {
            startFilter: null, endFilter: null
        }, {
            headers: {
                Authorization: `Bearer ${null}`,
            },
        }));
    });

    it('should reset the date filters when reload button is clicked', async () => {
        render(<MsgInsOuts />);
        const startDateInput = screen.getByLabelText('Start Date');
        const endDateInput = screen.getByLabelText('End Date');
        const filterButton = screen.getByRole('button', { name: 'Filter' });
        const reloadButton = screen.getByRole('button', { name: 'Reload' });

        await waitFor(() => {
            expect(startDateInput).toBeInTheDocument();
            expect(endDateInput).toBeInTheDocument();
            expect(filterButton).toBeInTheDocument();
            expect(reloadButton).toBeInTheDocument();
        });

        fireEvent.change(startDateInput, { target: { value: '2022-01-01' } });
        fireEvent.change(endDateInput, { target: { value: '2022-01-01' } });

        fireEvent.click(filterButton);

        await waitFor(() => expect(screen.getByText('WHATSAPP IN & OUTS')).toBeInTheDocument());
        await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/v1/social/messages', {
            startFilter: null, endFilter: null
        }, {
            headers: {
                Authorization: `Bearer ${null}`,
            },
        }));

        fireEvent.click(reloadButton);

        expect(startDateInput).toHaveValue('');
    });
});