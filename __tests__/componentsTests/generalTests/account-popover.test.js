import React from 'react';
import { AuthProvider } from '../../../src/contexts/auth';
import { CompanyProvider} from '../../../src/contexts/company';
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
        <CompanyProvider>
          <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
        </CompanyProvider>
      </AuthProvider>
    );

    // Assert
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });

  it('should click on "My Profile" and redirect to "/account"', () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    const pushMock = jest.fn();
    const useRouterMock = jest.spyOn(require('next/router'), 'useRouter');
    useRouterMock.mockImplementation(() => ({
      push: pushMock,
    }));

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <CompanyProvider>
          <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
        </CompanyProvider>
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/My Profile/i));

    // Assert
    expect(onClose).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/account');
  });

  it('should click on "Sign out" and redirect to "/"', async () => {
    // Mock
    const mockToken = 'fakeToken';
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    const pushMock = jest.fn();
    const useRouterMock = jest.spyOn(require('next/router'), 'useRouter');
    useRouterMock.mockImplementation(() => ({
      push: pushMock,
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
    }));

    // Render
    render(
      <AuthProvider initialState={{ token: mockToken }}>
        <CompanyProvider>
          <AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />
        </CompanyProvider>
      </AuthProvider>
    );

    // Act
    fireEvent.click(screen.getByText(/Sign out/i));
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/'));

    // Assert
    expect(onClose).toHaveBeenCalled();
    expect(pushMock).toHaveBeenCalledWith('/');
  });

});