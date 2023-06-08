import React from 'react';
import api from '../../../src/lib/axios';
import { render,  screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthGuard } from '../../../src/components/general/auth-guard';

jest.mock('../../../src/lib/axios');

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

/*
Test Suite for AuthGuard component

Test cases:
- renders children when verification is complete and user is authorized
- redirects to home page when verification is complete and user is not authorized
- redirects to home page when verification fails
- redirects to home page when token is not found
- should render loading indicator while verifying token
- should remove the JWT token from localStorage when invalid token
 */

describe('AuthGuard', () => {
  const token = 'fake-token';
  const mockChildren = <div data-testid="child">Hello World</div>;

  beforeEach(() => {
    localStorage.setItem('jwt', token);
  });

  afterEach(() => {
    localStorage.removeItem('jwt');
    jest.clearAllMocks();
  });

  test('renders children when verification is complete and user is authorized', async () => {
    const router = { isReady: true, replace: jest.fn() };
    useRouter.mockReturnValue(router);

    api.post.mockResolvedValueOnce({ data: { success: true } });

    const { getByTestId } = render(<AuthGuard>{mockChildren}</AuthGuard>);

    await waitFor(() => expect(getByTestId('child')).toBeInTheDocument());

    expect(api.post).toHaveBeenCalledWith('/api/verify-token', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  test('redirects to home page when verification is complete and user is not authorized', async () => {
    const router = { isReady: true, replace: jest.fn() };
    useRouter.mockReturnValue(router);

    api.post.mockResolvedValueOnce({ data: { success: false } });

    const { queryByTestId } = render(<AuthGuard>{mockChildren}</AuthGuard>);

    await waitFor(() => expect(queryByTestId('loading-indicator')).not.toBeInTheDocument());

    expect(api.post).toHaveBeenCalledWith('/api/verify-token', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      query: { continueUrl: undefined },
    });
  });

  test('redirects to home page when verification fails', async () => {
    const router = { isReady: true, replace: jest.fn() };
    useRouter.mockReturnValue(router);

    api.post.mockRejectedValueOnce(new Error('Verification failed'));

    const { queryByTestId } = render(<AuthGuard>{mockChildren}</AuthGuard>);

    await waitFor(() => expect(queryByTestId('loading-indicator')).not.toBeInTheDocument());

    expect(api.post).toHaveBeenCalledWith('/api/verify-token', {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      query: { continueUrl: undefined },
    });
  });

  test('redirects to home page when token is not found', async () => {

    const router = { isReady: true, replace: jest.fn() };
    useRouter.mockReturnValue(router);

    localStorage.removeItem('jwt');

    const { queryByTestId } = render(<AuthGuard>{mockChildren}</AuthGuard>);

    await waitFor(() => expect(queryByTestId('loading-indicator')).not.toBeInTheDocument());

    expect(api.post).not.toHaveBeenCalled();

    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      query: { continueUrl: undefined },
    });
  });

  it('should render loading indicator while verifying token', () => {
    // Set up mock values for isAuthorized and router.isReady
    useRouter.mockReturnValue({
      isReady: true,
      replace: jest.fn(),
    });
    localStorage.setItem('jwt', 'fake-token');
    api.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    render(
      <AuthGuard>
        <div>Test Component</div>
      </AuthGuard>
    );

    const loadingIndicator = screen.getByTestId('loading-indicator');
    expect(loadingIndicator).toBeInTheDocument();
  });

  test('should remove the JWT token from localStorage when invalid token', async () => {
    const router = { isReady: true, replace: jest.fn() };
    useRouter.mockReturnValue(router);
  
    // Mock response for invalid token verification
    api.post.mockResolvedValueOnce({ data: { success: false } });
  
    localStorage.setItem('jwt', 'invalid-token');
  
    const { queryByTestId } = render(<AuthGuard>{mockChildren}</AuthGuard>);
  
    await waitFor(() => expect(queryByTestId('loading-indicator')).not.toBeInTheDocument());
  
    expect(api.post).toHaveBeenCalledWith('/api/verify-token', {}, {
      headers: { Authorization: 'Bearer invalid-token' },
    });
  
    expect(router.replace).toHaveBeenCalledWith({
      pathname: '/',
      query: { continueUrl: undefined },
    });
  
    // Verify that the JWT token was removed from localStorage
    expect(localStorage.getItem('jwt')).toBeNull();
  });
  
});
