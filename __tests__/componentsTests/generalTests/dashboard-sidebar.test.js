import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../src/theme';
import { DashboardSidebar } from '../../../src/components/general/dashboard-sidebar';

// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: () => ({
      pathname: '/',
    }),
  }));

/*
Test Suite for DashboardSidebar component

Test cases:
- renders the sidebar
- renders a permanent sidebar on large screens
- does not render when the screen size is smaller than lg
*/

describe('DashboardSidebar', () => {
    it('should render successfully', () => {
        const { container } = render(
          <ThemeProvider theme={theme}>
            <DashboardSidebar />
          </ThemeProvider>
        );
        expect(container).toBeTruthy();
    });

    it('should render a permanent sidebar on large screens', () => {
        const { container } = render(
          <ThemeProvider theme={theme}>
            <DashboardSidebar />
          </ThemeProvider>
        );

        const temporarySidebar = container.querySelector('.MuiDrawer-modal');
        const permanentSidebar = container.querySelector('.MuiDrawer-docked');

        expect(temporarySidebar).toBeNull();
        expect(permanentSidebar).toBeTruthy();
      });

    describe('render when the screen size is smaller than lg', () => {
        beforeEach(() => {
          window.matchMedia = jest.fn().mockImplementation(query => ({
            addListener: jest.fn(),
            matches: query === '(max-width:1199px)',
            removeListener: jest.fn(),
          }));
        });
        
        it('should not render when the screen size is smaller than lg', () => {
          render(
            <ThemeProvider theme={theme}>
              <DashboardSidebar />
            </ThemeProvider>
          );
          const sidebar = screen.queryByTestId('dashboard-sidebar');
          expect(sidebar).not.toBeInTheDocument();
        });
    })
});