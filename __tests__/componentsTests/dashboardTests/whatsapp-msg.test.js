import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WhatsappMsg } from '../../../src/components/dashboard/whatsapp-msg';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('WhatsappMsg', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the component', async () => {
    const mockResponse = {
        data: {
            success: true,
            active: [],
            messages: []
        }
    };
    api.get.mockResolvedValue(mockResponse);

    render(<WhatsappMsg />);
    await waitFor(() => expect(screen.getByText(/Whatsapp Msg/i)).toBeInTheDocument());
  });

  it('should fetch the message limit from the API', async () => {
    const mockResponse = {
        data: {
            success: true,
            active: [
                { msg_qty: 100 },
                { msg_qty: 200 },
                { msg_qty: 300 }
            ]
        }
    };
    api.get.mockResolvedValue(mockResponse);

    render(<WhatsappMsg />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/purchases/active', expect.any(Object)));
    expect(screen.getByText(/Messages limit: 600/i)).toBeInTheDocument();
  });

  it('should handle errors when fetching the message limit', async () => {
    const mockGet = jest.spyOn(api, 'get').mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<WhatsappMsg />);
    await waitFor(() => expect(mockGet).toHaveBeenCalledWith('/api/v1/purchases/active', expect.any(Object)));
    expect(screen.queryByText('Total:')).not.toBeInTheDocument();
  });

  it('should fetch the message count from the API', async () => {
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

    render(<WhatsappMsg />);
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/api/v1/social/messages', { isRenewal: true }, expect.any(Object)));
    expect(screen.getByText('3')).toBeInTheDocument();
  });

//   it('should handle errors when fetching the message count', async () => {
//     const mockPost = jest.spyOn(api, 'post').mockRejectedValueOnce(new Error('Failed to fetch'));

//     render(<WhatsappMsg />);
//     await waitFor(() => expect(mockPost).toHaveBeenCalledWith('/api/v1/social/messages', { isRenewal: true }, expect.any(Object)));
//     expect(screen.queryByText('Messages:')).not.toBeInTheDocument();
//   });
});