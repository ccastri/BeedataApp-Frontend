import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { WhatsappMsg } from '../../../src/components/dashboard/whatsapp-msg';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('WhatsappMsg', () => {
    afterEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    it('should render the component', async () => {
        render(<WhatsappMsg />);
        const title = await screen.getByText(/Whatsapp Msg/i);
        expect(title).toBeInTheDocument();
    });

    it('should fetch data from the API', async () => {
        const getSpy = jest.spyOn(api, 'get');
        render(<WhatsappMsg />);
        await waitFor(() => expect(getSpy).toHaveBeenCalled());
    });

});