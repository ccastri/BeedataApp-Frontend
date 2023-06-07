import React from 'react';
import { render, fireEvent, act, screen, waitFor } from '@testing-library/react';
import Login from '../../src/pages/index';
import Router from 'next/router';
import api from '../../src/lib/axios';

jest.mock('../../src/lib/axios');

jest.mock('next/router', () => ({
    push: jest.fn(),
}))

/*
Test suite for Login Page

Test cases:
- has empty initial values for email and password fields
- validates email and password fields correctly
- submits the form with correct values
*/

describe('Login Page', () => {
    afterEach(() => {
        jest.resetAllMocks();
    });

    test('has empty initial values for email and password fields', () => {
        const { getByLabelText } = render(<Login />);
        expect(getByLabelText('Email')).toHaveValue('');
        expect(getByLabelText('Password')).toHaveValue('');
    });

    test('validates email and password fields correctly', async () => {
        render(<Login />);
      
        // Submit form with empty fields
        fireEvent.submit(screen.getByText('Sign In Now'));
      
        await waitFor(() => {
          expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
          expect(screen.getByText('Password is required')).toBeInTheDocument();
        });
      });

      test('submits the form with correct values', async () => {
        const mockData = { success: true, token: 'mock_token' };
        api.post.mockResolvedValue({ data: mockData });
    
        render(<Login />);
    
        // Fill out form fields
        fireEvent.change(screen.getByLabelText('Email'), {
          target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
          target: { value: 'Password123' },
        });
    
        // Submit form
        fireEvent.submit(screen.getByText('Sign In Now'));
    
        await waitFor(() => {
          expect(api.post).toHaveBeenCalledWith('/api/login', {
            email: 'test@example.com',
            password: 'Password123',
          });
    
          expect(localStorage.getItem('jwt')).toBe('mock_token');
          expect(Router.push).toHaveBeenCalledWith('/coming-soon');
        });
      });
});

 
