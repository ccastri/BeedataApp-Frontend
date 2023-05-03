import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import api from '../../src/lib/axios';
import Router from 'next/router';
import Register from '../../src/pages/register';

jest.mock('../../src/lib/axios');

jest.mock('next/router', () => ({
    push: jest.fn(),
}))


describe('Register', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    it('should render the registration form', () => {
        render(<Register />);
        expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Identification Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Identification Number')).toBeInTheDocument();
        expect(screen.getByLabelText('Company')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });
});