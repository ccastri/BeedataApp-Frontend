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
        expect(screen.getByLabelText('First Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Company')).toBeInTheDocument();
        expect(screen.getByLabelText('Role')).toBeInTheDocument();
        expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    // it("should submit the form successfully", async () => {
    //   axios.post.mockResolvedValue({ data: { success: true } });

    //   render(<Register />);

    //   act(() => {
    //     fireEvent.change(screen.getByLabelText("First Name"), { target: { value: "John" } });
    //     fireEvent.change(screen.getByLabelText("Last Name"), { target: { value: "Doe" } });
    //     fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Test Company" } });
    //     fireEvent.change(screen.getByLabelText("Email Address"), { target: { value: "john.doe@example.com" } });
    //     fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
    //     fireEvent.change(screen.getByLabelText("Confirm Password"), { target: { value: "password" } });
    //     fireEvent.click(screen.getByTestId('policy-checkbox'))

        
    //     fireEvent.submit(screen.getByText("Sign Up Now"));
    //   });

    //   await waitFor(() => {
    //     expect(axios.post).toHaveBeenCalledWith("/api/register", {
    //       email: "john.doe@example.com",
    //       firstName: "John",
    //       lastName: "Doe",
    //       company: "Test Company",
    //       password: "password",
    //       confirmPassword: "password",
    //       policy: true
    //     });
    //     expect(Router.push).toHaveBeenCalledWith("/");
    //   });
  
   
    // });

    // it("should show an error message if the form submission fails", async () => {
    //   const { getByLabelText, getByText } = render(<Register />);
    //   axios.post.mockRejectedValue({ response: { status: 409, data: { message: "Email already exists" } } });
  
    //   await act(async () => {
    //     fireEvent.change(getByLabelText("First Name"), { target: { value: "John" } });
    //     fireEvent.change(getByLabelText("Last Name"), { target: { value: "Doe" } });
    //     fireEvent.change(getByLabelText("Company"), { target: { value: "Test Company" } });
    //     fireEvent.change(getByLabelText("Email Address"), { target: { value: "john.doe@example.com" } });
    //     fireEvent.change(getByLabelText("Password"), { target: { value: "password" } });
    //     fireEvent.change(getByLabelText("Confirm Password"), { target: { value: "password" } });
    //     fireEvent.click(screen.getByTestId('policy-checkbox'))

    //     fireEvent.click(screen.getByRole('button', { name: 'Sign Up Now' }))
    //   });

    //   await waitFor(() => {
    //     expect(axios.post).toHaveBeenCalledWith("/api/register", {
    //       email: "john.doe@example.com",
    //       firstName: "John",
    //       lastName: "Doe",
    //       company: "Test Company",
    //       password: "password",
    //       confirmPassword: "password",
    //       policy: true
    //     });
    //   });
  
    //   await waitFor(() => {
    //     expect(getByText("Email already exists")).toBeInTheDocument();
    //   })
    // });
});