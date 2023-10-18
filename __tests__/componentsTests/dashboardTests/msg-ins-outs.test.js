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
        api.get.mockResolvedValue({
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
    
});