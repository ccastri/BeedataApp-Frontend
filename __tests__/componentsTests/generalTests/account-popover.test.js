import React from 'react';
import { AuthProvider } from '../../../src/contexts/auth';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { AccountPopover } from '../../../src/components/general/account-popover';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AccountPopover', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  useRouter.mockReturnValue(mockRouter);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
      </AuthProvider>
    );

    // Assert
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });

  it('should call onClose when profile is clicked', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/My Profile/i));

    // Assert
    expect(onClose).toHaveBeenCalled();
  });

  it('redirects to account page when profile is clicked', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/My Profile/i));

    // Assert
    expect(mockRouter.push).toHaveBeenCalledWith('/account');
  });

  it('calls onClose and removes jwt cookie when sign out is clicked', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/Sign out/i));

    // Assert
    expect(onClose).toHaveBeenCalled();

  });

  it('redirects to home page when sign out is clicked', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/Sign out/i));

    // Assert
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});