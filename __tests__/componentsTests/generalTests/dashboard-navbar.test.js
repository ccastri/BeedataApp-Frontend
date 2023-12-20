import { AuthProvider } from '../../../src/contexts/auth';
import { CompanyProvider } from '../../../src/contexts/company';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { DashboardNavbar } from '../../../src/components/general/dashboard-navbar';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('DashboardNavbar', () => {
    const mockTheme = createTheme();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render dashboard navbar', () => {
        // Mock
        const mockPayload = { userName: 'Test User' };
        const mockToken = `header.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

        // Render
        render(
            <ThemeProvider theme={mockTheme}>
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyProvider>
                        <DashboardNavbar onSidebarOpen={() => { }} />
                    </CompanyProvider>
                </AuthProvider>
            </ThemeProvider>
        );

        // Assert
        expect(screen.getByTestId('dashboard-navbar-title')).toBeInTheDocument();
    });

    it(' should show user name when user is logged in', () => {
        // Mock
        const mockPayload = { userName: 'Test User' };
        const mockToken = `header.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

        // Render
        render(
            <ThemeProvider theme={mockTheme}>
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyProvider>
                        <DashboardNavbar onSidebarOpen={() => { }} />
                    </CompanyProvider>
                </AuthProvider>
            </ThemeProvider>
        );

        // Assert
        expect(screen.getByText(mockPayload.userName.toUpperCase())).toBeInTheDocument();
    });

    it('should show account popover when user clicks on user name', async () => {
        // Mock
        const mockPayload = { userName: 'Test User' };
        const mockToken = `header.${Buffer.from(JSON.stringify(mockPayload)).toString('base64')}.signature`;

        // Render
        render(
            <ThemeProvider theme={mockTheme}>
                <AuthProvider initialState={{ token: mockToken }}>
                    <CompanyProvider>
                        <DashboardNavbar onSidebarOpen={() => { }} />
                    </CompanyProvider>
                </AuthProvider>
            </ThemeProvider>
        );

        // Act
        await act(async () => {
            fireEvent.click(screen.getByTestId('dashboard-navbar-avatar'));
        });

        // Assert
        expect(screen.getByText('Sign out')).toBeInTheDocument();
    });

    it('should not show user name when user is not logged in', () => {
        // Mock
        const mockPayload = { userName: 'Test User' };

        // Render
        render(
            <ThemeProvider theme={mockTheme}>
                <AuthProvider initialState={{ token: '' }}>
                    <CompanyProvider>
                        <DashboardNavbar onSidebarOpen={() => { }} />
                    </CompanyProvider>
                </AuthProvider>
            </ThemeProvider>
        );

        // Assert
        expect(screen.queryByText(mockPayload.userName.toUpperCase())).not.toBeInTheDocument();
    });
});