import { AuthProvider } from '../../../src/contexts/auth';
import { CompanyProvider } from '../../../src/contexts/company';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DropDown } from '../../../src/components/general/dropdown-list';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');
const mockTheme = createTheme();

describe('DropDown', () => {
  const mockCompanies = [
    { name: 'Company 1', id: '1' },
    { name: 'Company 2', id: '2' },
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({
      data: {
        success: true,
        companies: mockCompanies,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render dropdown', async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={mockTheme}>
              <AuthProvider>
                <CompanyProvider>
                  <DropDown />
                </CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          );
    });

    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={mockTheme}>
              <AuthProvider>
                <CompanyProvider>
                  <DropDown />
                </CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          );
    });

    fireEvent.click(screen.getByText('Companies'));

    await waitFor(() => expect(screen.getByText('Company 1')).toBeInTheDocument());
  });

  it('should close dropdown when clicked again', async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={mockTheme}>
              <AuthProvider>
                <CompanyProvider>
                  <DropDown />
                </CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          );
    });

    fireEvent.click(screen.getByText('Companies'));
    await waitFor(() => expect(screen.getByText('Company 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Companies'));
    await waitFor(() => expect(screen.queryByText('Company 1')).not.toBeInTheDocument());
  });

  it('should fetch and display companies', async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={mockTheme}>
              <AuthProvider>
                <CompanyProvider>
                  <DropDown />
                </CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          );
    });

    fireEvent.click(screen.getByText('Companies'));

    await waitFor(() => {
      expect(screen.getByText('Company 1')).toBeInTheDocument();
      expect(screen.getByText('Company 2')).toBeInTheDocument();
    });
  });

  it('should highlight selected company', async () => {
    await act(async () => {
        render(
            <ThemeProvider theme={mockTheme}>
              <AuthProvider>
                <CompanyProvider>
                  <DropDown />
                </CompanyProvider>
              </AuthProvider>
            </ThemeProvider>
          );
    });

    fireEvent.click(screen.getByText('Companies'));
    await waitFor(() => expect(screen.getByText('Company 1')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Company 1'));
    await waitFor(() => expect(screen.getByTestId('selected-company')).toBeInTheDocument());
  });
});




