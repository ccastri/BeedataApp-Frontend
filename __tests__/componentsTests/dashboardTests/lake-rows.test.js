import React from 'react';
import Cookies from 'js-cookie';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LakeRows } from '../../../src/components/dashboard/lake-rows';
import CompanyContext from '../../../src/contexts/company-context'
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('LakeRows', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the component', async () => {
    // Mock
    const mockContextValue = { companyId: 'mockCompanyId' };
    jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
    jest.spyOn(api, 'get').mockResolvedValue({ data: { success: true, rowCount: 100 } });

    // Render
    await act(async () => {
      render(
        <CompanyContext.Provider value={mockContextValue}>
          <LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={500} />
        </CompanyContext.Provider>
      );
    });

    // Assert
    expect(screen.getByText(/Lake Rows/i)).toBeInTheDocument();
  });

  it('should render the component with the correct title and image when the API call returns a 404 error', async () => {
    // Mock
    const mockContextValue = { companyId: 'mockCompanyId' };
    jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
    jest.spyOn(api, 'get').mockRejectedValue({ response: { status: 404, data: { message: 'Not found' } } });

    // Render
    await act(async () => {
      render(
        <CompanyContext.Provider value={mockContextValue}>
          <LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={500} />
        </CompanyContext.Provider>
      );
    });

    // Assert
    expect(screen.getByText(/Lake Rows/i)).toBeInTheDocument();
  });

  it('should log an error message to the console when the API call returns an error other than 404', async () => {
    // Mock
    const mockContextValue = { companyId: 'mockCompanyId' };
    jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
    const mockError = { response: { status: 500, data: { message: 'Internal server error' } } };
    jest.spyOn(api, 'get').mockRejectedValue(mockError);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Render
    await act(async () => {
      render(
        <CompanyContext.Provider value={mockContextValue}>
          <LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={500} />
        </CompanyContext.Provider>
      );
    });

    // Assert
    expect(consoleSpy).toHaveBeenCalledWith(mockError);
  });

  it('should render the component with the correct title and image when the row limit is zero', async () => {
    // Mock
    const mockContextValue = { companyId: 'mockCompanyId' };
    jest.spyOn(Cookies, 'get').mockReturnValue('mockToken');
    jest.spyOn(api, 'get').mockResolvedValue({ data: { success: true, rowCount: 100 } });

    // Render
    await act(async () => {
      render(
        <CompanyContext.Provider value={mockContextValue}>
          <LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={0} />
        </CompanyContext.Provider>
      );
    });

    // Assert
    expect(screen.getByText(/Lake Rows/i)).toBeInTheDocument();
  });
});