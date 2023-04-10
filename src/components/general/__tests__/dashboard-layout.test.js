import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../theme';
import { DashboardLayout } from '../dashboard-layout';



// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: () => ({
      pathname: '/',
    }),
  }));

jest.mock('../auth-guard', () => ({
    AuthGuard: ({ children }) => <div>{children}</div>
}));
  
  describe('DashboardLayout', () => {
    it('renders children and sidebar', () => {
        render(
            <ThemeProvider theme={theme}>
                <DashboardLayout>
                    <div>Test</div>
                </DashboardLayout>
            </ThemeProvider>
        );
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
          render(
            <ThemeProvider theme={theme}>
              <DashboardLayout>
                <div>Test</div>
              </DashboardLayout>
            </ThemeProvider>
          );
          expect(screen.getByText('Test')).toBeInTheDocument();
          expect(screen.queryByTestId('hidden-dashboard-sidebar')).toBeInTheDocument();
    
        });
      });
  });