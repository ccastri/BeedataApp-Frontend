import { AuthProvider } from '../../../src/contexts/auth';
import { CompanyProvider } from '../../../src/contexts/company';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { DashboardSidebar } from '../../../src/components/general/dashboard-sidebar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { getUserRole } from '../../../src/utils/get-user-data';

jest.mock('next/router', () => ({
    useRouter: jest.fn(),
}));

jest.mock('../../../src/utils/get-user-data', () => ({
    getUserRole: jest.fn(),
}));

describe('DashboardSidebar', () => {
    beforeEach(() => {
        useRouter.mockImplementation(() => ({
            isReady: true,
            asPath: '/',
        }));
        getUserRole.mockImplementation(() => 'superadmin');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders without crashing', () => {
        render(
            <AuthProvider>
                <CompanyProvider>
                    <ThemeProvider theme={createTheme()}>
                        <DashboardSidebar open={true} />
                    </ThemeProvider>
                </CompanyProvider>
            </AuthProvider>
        );
    });

    it('renders the correct number of NavItems', () => {
        render(
            <AuthProvider>
                <CompanyProvider>
                    <ThemeProvider theme={createTheme()}>
                        <DashboardSidebar open={true} />
                    </ThemeProvider>
                </CompanyProvider>
            </AuthProvider>
        );
        const navItems = screen.getAllByRole('listitem');
        expect(navItems).toHaveLength(6);
    });

    it('calls onClose when the router path changes', async () => {
        const onClose = jest.fn();
        render(
            <AuthProvider>
                <CompanyProvider>
                    <ThemeProvider theme={createTheme()}>
                        <DashboardSidebar open={true} onClose={onClose} />
                    </ThemeProvider>
                </CompanyProvider>
            </AuthProvider>
        );
        act(() => {
            useRouter.mockImplementation(() => ({
                isReady: true,
                asPath: '/new-path',
            }));
        });
        await waitFor(() => expect(onClose).toHaveBeenCalled());
    });
});