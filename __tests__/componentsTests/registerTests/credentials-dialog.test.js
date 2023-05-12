import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CredentialDialog } from '../../../src/components/register/credentials-dialog';
import { decryptPwd } from '../../../src/utils/decrypt-pwd'; 
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));  

// Mock the 'decryptPwd' function
jest.mock('../../../src/utils/decrypt-pwd', () => ({
  decryptPwd: jest.fn(),
}));

const mockUser = {
  email: 'testuser@test.com',
  encrypted_pwd: 'encryptedPassword',
};

describe('CredentialDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should render the dialog with the user credentials', () => {
    const onCloseMock = jest.fn();

    decryptPwd.mockReturnValue('password');

    render(<CredentialDialog user={mockUser} openCredentials={true} onClose={onCloseMock} />);

    const emailText = screen.getByText(`${mockUser.email}`);
    expect(emailText).toBeInTheDocument();

    const passwordText = screen.getByText('password');
    expect(passwordText).toBeInTheDocument();
 });

  it('should call the onClose function when the dialog is closed', () => {
    const onCloseMock = jest.fn();

    render(<CredentialDialog user={mockUser} openCredentials={true} onClose={onCloseMock} />);

    const closeButton = screen.getByRole('button', { name: 'close' });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('should redirect to / when the "Sign in Now" button is clicked', () => {
    const onCloseMock = jest.fn();

    useRouter.mockReturnValue({ push: jest.fn() });

    render(<CredentialDialog user={mockUser} openCredentials={true} onClose={onCloseMock} />);

    const signInButton = screen.getByRole('button', { name: 'Sign in Now' });
    fireEvent.click(signInButton);

    expect(useRouter().push).toHaveBeenCalledTimes(1);
    expect(useRouter().push).toHaveBeenCalledWith('/');
  });
  
});
