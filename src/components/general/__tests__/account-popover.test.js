import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { AccountPopover } from '../account-popover';

import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const viewports = [
  { width: 320, height: 480 }, // iPhone 5/SE
  { width: 360, height: 640 }, // Pixel 2
  { width: 375, height: 667 }, // iPhone 6/7/8
  { width: 414, height: 736 }, // iPhone 6/7/8 Plus
  { width: 768, height: 1024 }, // iPad
  { width: 1024, height: 768 }, // iPad landscape
  { width: 1280, height: 800 }, // Laptop
  { width: 1440, height: 900 }, // Laptop
  { width: 1920, height: 1080 }, // Desktop
  { width: 2560, height: 1440 }, // Desktop
];

describe.each(viewports)('AccountPopover (%p)', (viewport) => {
  beforeEach(() => {
    // set viewport size for the test
    Object.defineProperty(window, 'innerWidth', {
      value: viewport.width,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: viewport.height,
      writable: true,
    });
    window.dispatchEvent(new Event('resize'));
  });

  it('should render the user name', () => {
    const props = {
      anchorEl: document.createElement('div'),
      onClose: jest.fn(),
      open: true
    };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlVzZXIgTmFtZSIsImlhdCI6MTYyMDc5OTg1Nn0.X2N8_6N36X0KjMAvM0hPcSkG40wOmKXXzHi1ZbYJPP8';
    localStorage.setItem('jwt', token);
    render(<AccountPopover {...props} />);
    expect(screen.getByText('User Name')).toBeInTheDocument();
  });

  it('should not render the sign out button when not authenticated', () => {
    const props = {
      anchorEl: document.createElement('div'),
      onClose: jest.fn(),
      open: true
    };
    localStorage.clear(); // clear localStorage
    render(<AccountPopover {...props} />);
    expect(screen.queryByText('Sign out')).toBeNull();
  });

  it('should render the sign out button when authenticated', () => {
    const props = {
      anchorEl: document.createElement('div'),
      onClose: jest.fn(),
      open: true
    };
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlVzZXIgTmFtZSIsImlhdCI6MTYyMDc5OTg1Nn0.X2N8_6N36X0KjMAvM0hPcSkG40wOmKXXzHi1ZbYJPP8';
    localStorage.setItem('jwt', token);
    render(<AccountPopover {...props} />);
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('should call onClose when the popover is closed', async() => {
    const router = { push: jest.fn() };
    useRouter.mockReturnValue(router);
    
    const props = {
      anchorEl: document.createElement('div'),
      onClose: jest.fn(),
      open: true
    };

    render(<AccountPopover {...props} />);
    fireEvent.click(screen.getByText('Sign out'));
    await waitFor(() => {
      expect(props.onClose).toHaveBeenCalled();
    })

    expect(localStorage.getItem('jwt')).toBeNull();
  });
});
