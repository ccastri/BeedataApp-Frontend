import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  const formikValues = { fullName: 'John Doe', company: 'Acme Inc.', identificationType: 'PP', identificationNumber: '1234567890', phoneNumber: '+1 123-456-7890', email: 'johndoe@example.com', role: 'Developer' };
  const onSubmitMock = jest.fn();

  it('renders the sign up button', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={onSubmitMock} />);
    const signUpButton = screen.getByRole('button', { name: /sign up now/i });
    expect(signUpButton).toBeInTheDocument();
  });

  it('opens the dialog when the button is clicked', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={onSubmitMock} />);
    const signUpButton = screen.getByRole('button', { name: /sign up now/i });
    fireEvent.click(signUpButton);
    const dialogTitle = screen.getByRole('heading', { name: /confirm your information/i });
    expect(dialogTitle).toBeInTheDocument();
  });

  it('displays the formik values inside the dialog', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={onSubmitMock} />);
    const signUpButton = screen.getByRole('button', { name: /sign up now/i });
    fireEvent.click(signUpButton);
    const fullName = screen.getByText('John Doe');
    expect(fullName).toBeInTheDocument();
    const company = screen.getByText('Acme Inc.');
    expect(company).toBeInTheDocument();
    const identification = screen.getByText('1234567890');
    expect(identification).toBeInTheDocument();
    const phoneNumber = screen.getByText('+1 123-456-7890');
    expect(phoneNumber).toBeInTheDocument();
    const email = screen.getByText('johndoe@example.com');
    expect(email).toBeInTheDocument();
    const role = screen.getByText('Developer');
    expect(role).toBeInTheDocument();
  });

  it('calls onSubmit prop when submit button is clicked', () => {
    render(<ResponsiveDialog formikValues={formikValues} onSubmit={onSubmitMock} />);
    const signUpButton = screen.getByRole('button', { name: /sign up now/i });
    fireEvent.click(signUpButton);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    expect(onSubmitMock).toHaveBeenCalledTimes(1);
  });
});
