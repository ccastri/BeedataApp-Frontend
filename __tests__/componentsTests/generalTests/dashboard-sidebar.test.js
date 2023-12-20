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
    const mockTheme = createTheme();

    beforeEach(() => {
        useRouter.mockImplementation(() => ({
            isReady: true,
            asPath: '/dashboard',
        }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render dashboard sidebar', () => {
        getUserRole.mockReturnValue('user');
        
        render(
            <ThemeProvider theme={mockTheme}>
                <DashboardSidebar open={true} onClose={jest.fn()} />
            </ThemeProvider>
        );

        expect(screen.getByTestId('dashboard-sidebar')).toBeInTheDocument();
    });

    it('should render companies item when user role is superadmin', () => {
        getUserRole.mockReturnValue('superadmin');

        render(
            <AuthProvider>
                <CompanyProvider>
                    <ThemeProvider theme={mockTheme}>
                        <DashboardSidebar open={true} onClose={jest.fn()} />
                    </ThemeProvider>
                </CompanyProvider>
            </AuthProvider>
        );

        expect(screen.getByText('Companies')).toBeInTheDocument();
    });

    it('should not render user items when user role is not superadmin or partner', () => {
        getUserRole.mockReturnValue('user');

        render(
            <ThemeProvider theme={mockTheme}>
                <DashboardSidebar open={true} onClose={jest.fn()} />
            </ThemeProvider>
        );

        expect(screen.queryByText('Users')).not.toBeInTheDocument();
    });
});