import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../src/theme';
import { DashboardLayout } from '../../../src/components/general/dashboard-layout';



// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: () => ({
      pathname: '/',
    }),
  }));

jest.mock('../../../src/components/general/auth-guard', () => ({
    AuthGuard: ({ children }) => <div>{children}</div>
}));

/*
Test Suite for DashboardLayout component

Test cases:
- renders children and sidebar
- renders with sidebar closed and can be opened by navbar
*/
  
describe('DashboardLayout', () => {
  it('renders children and sidebar', () => {
    act(() => {
      render(
        <ThemeProvider theme={theme}>
          <DashboardLayout>
            <div>Test</div>
          </DashboardLayout>
        </ThemeProvider>
      );
    });

    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
  });

  describe('when the screen size is smaller than lg', () => {
    beforeEach(() => {
      window.matchMedia = jest.fn().mockImplementation(query => ({
        addListener: jest.fn(),
        matches: query === '(max-width:1199px)',
        removeListener: jest.fn(),
      }));
    });

    it('renders with sidebar closed and can be opened by navbar', () => {
      act(() => {
        render(
          <ThemeProvider theme={theme}>
            <DashboardLayout>
              <div>Test</div>
            </DashboardLayout>
          </ThemeProvider>
        );
      });

      expect(screen.getByText('Test')).toBeInTheDocument();
      expect(screen.queryByTestId('hidden-dashboard-sidebar')).toBeInTheDocument();
    });
  });
});