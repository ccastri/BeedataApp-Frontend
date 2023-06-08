import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../../src/pages/register';

jest.mock('../../src/lib/axios');

jest.mock('next/router', () => ({
    push: jest.fn(),
}))


describe('Register', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render all the input form fields', () => {
        render(<Register />);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Company')).toBeInTheDocument();
        expect(screen.getByLabelText('Identification Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Identification Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
        expect(screen.getByTestId('policy-checkbox')).toBeInTheDocument();
    });

});