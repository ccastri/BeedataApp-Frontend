import React from 'react';
import api from '../../../src/lib/axios';
import { AuthProvider } from '../../../src/contexts/auth';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthGuard } from '../../../src/components/general/auth-guard';

jest.mock('../../../src/lib/axios');
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('AuthGuard', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should render loading indicator while verification is in progress', async () => {
    // Mock
    const mockToken = 'fakeToken';
    api.post.mockResolvedValue({ data: { success: true } });
    useRouter.mockReturnValue({ isReady: false });

    // Render
    await act(async () => {
      render(
        <AuthProvider initialState={{ token: mockToken }}>
          <AuthGuard />
        </AuthProvider>
      );
    });

    // Assert
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });

  it('should render children when user is authorized', async () => {
    // Mock
    const mockToken = 'fakeToken';
    api.post.mockResolvedValue({ data: { success: true } });
    useRouter.mockReturnValue({ isReady: true });

    // Render
    await act(async () => {
      render(
        <AuthProvider initialState={{ token: mockToken }}>
          <AuthGuard>
            <div>Authorized Content</div>
          </AuthGuard>
        </AuthProvider>
      );
    });

    // Assert
    await waitFor(() => expect(screen.getByText('Authorized Content')).toBeInTheDocument());
  });

  it('should redirect to login when user is not authorized', async () => {
    // Mock
    const mockRouter = { isReady: true, replace: jest.fn() };
    const mockToken = 'fakeToken';
    api.post.mockResolvedValue({ data: { success: false } });
    useRouter.mockReturnValue(mockRouter);

    // Render
    await act(async () => {
      render(
        <AuthProvider initialState={{ token: mockToken }}>
          <AuthGuard />
        </AuthProvider>
      );
      jest.runAllTimers();
    });

    // Assert
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith({ pathname: '/', query: { continueUrl: mockRouter.asPath } }));
  });

});
