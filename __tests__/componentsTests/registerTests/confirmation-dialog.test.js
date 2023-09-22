import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResponsiveDialog } from '../../../src/components/register/confirmation-dialog';

/*
Test suite for the ResponsiveDialog component.

test cases:
- renders the sign up button
- opens the dialog when the button is clicked
- displays the formik values inside the dialog
- calls onSubmit prop when submit button is clicked
*/

describe('ResponsiveDialog', () => {
  const formikValues = {
    fullName: 'John Doe',
    company: 'Acme Inc.',
    identificationType: 'Passport',
    identificationNumber: '123456789',
    phoneNumber: '555-1234',
    email: 'john.doe@example.com',
    role: 'Manager',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Sign Up Now" button', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={() => {}} />);
    const button = screen.getByRole('button', { name: 'Sign Up Now' });
    expect(button).toBeInTheDocument();
  });

  it('opens the dialog when the "Sign Up Now" button is clicked', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={() => {}} />);
    const button = screen.getByRole('button', { name: 'Sign Up Now' });
    fireEvent.click(button);
    const dialogTitle = screen.getByRole('heading', { name: 'Confirm Your Information' });
    expect(dialogTitle).toBeInTheDocument();
  });

  it('displays the user information in the dialog', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={() => {}} />);
    const button = screen.getByRole('button', { name: 'Sign Up Now' });
    fireEvent.click(button);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Acme Inc.')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('555-1234')).toBeInTheDocument();
    expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('calls the onSubmit function when the "Submit" button is clicked', () => {
    const handleSubmit = jest.fn();
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={handleSubmit} />);
    const button = screen.getByRole('button', { name: 'Sign Up Now' });
    fireEvent.click(button);
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('closes the dialog when the "Edit" button is clicked', async () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={() => {}} />);
    const button = screen.getByRole('button', { name: 'Sign Up Now' });
    fireEvent.click(button);
    const editButton = screen.getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);
    await waitFor(() => {
      const dialogTitle = screen.queryByRole('heading', { name: 'Confirm Your Information' });
      expect(dialogTitle).not.toBeInTheDocument();
    });
  });
});