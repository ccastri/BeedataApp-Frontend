import React from 'react';
import { render, screen, fireEvent} from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../../src/theme';
import { DashboardNavbar } from '../../../src/components/general/dashboard-navbar';

describe('DashboardNavbar component', () => {
    it('should render successfully', () => {
        const { container } = render(
          <ThemeProvider theme={theme}>
            <DashboardNavbar />
          </ThemeProvider>
        );
        expect(container).toBeTruthy();
    });


    it('should open the sidebar on click of the menu button', () => {
        const onSidebarOpenMock = jest.fn();
        render(
        <ThemeProvider theme={theme}>
            <DashboardNavbar onSidebarOpen={onSidebarOpenMock} />
        </ThemeProvider>
        );
        const menuButton = screen.getByTestId('MenuIcon');

        fireEvent.click(menuButton);
        expect(onSidebarOpenMock).toHaveBeenCalled();
    });

    it('should open the account popover on click of the avatar', () => {
        render(
          <ThemeProvider theme={theme}>
            <DashboardNavbar />
          </ThemeProvider>
        );
        const avatar = screen.getByRole('img');
        fireEvent.click(avatar);

        const accountPopover = screen.getByRole('presentation');
        expect(accountPopover).toBeInTheDocument();
      });
});