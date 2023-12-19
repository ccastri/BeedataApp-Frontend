import React from 'react';
import Cookies from 'js-cookie';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { AccountPopover } from '../../../src/components/general/account-popover';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('js-cookie');

describe('AccountPopover', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  useRouter.mockReturnValue(mockRouter);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    render(<AccountPopover anchorEl={anchorEl} onClose={onClose} open={true} />);
    expect(screen.getByText(/My Profile/i)).toBeInTheDocument();
  });

  it('should call onClose when profile is clicked', () => {
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    render(<AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText(/My Profile/i));
    expect(onClose).toHaveBeenCalled();
  });

  it('redirects to account page when profile is clicked', () => {
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    render(<AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText(/My Profile/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/account');
  });

  it('calls onClose and removes jwt cookie when sign out is clicked', () => {
    Cookies.get.mockReturnValue('fakeToken');
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    render(<AccountPopover anchorEl={anchorEl} open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText(/Sign out/i));
    expect(onClose).toHaveBeenCalled();
    expect(Cookies.remove).toHaveBeenCalledWith('jwt', { path: '/', secure: true });
  });

  it('redirects to home page when sign out is clicked', () => {
    Cookies.get.mockReturnValue('fakeToken');
    const anchorEl = document.createElement('div');
    const onClose = jest.fn();
    render(<AccountPopover anchorEl={anchorEl} open={true} onClose={onClose}/>);
    fireEvent.click(screen.getByText(/Sign out/i));
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});