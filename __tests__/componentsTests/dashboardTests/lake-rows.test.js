import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LakeRows } from '../../../src/components/dashboard/lake-rows';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('LakeRows', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render the component', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, rowCount: 100 } });
    await act(async () => {
      render(<LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={500}/>);
    });
    const lakeRows = screen.getByText(/Lake Rows/i);
    expect(lakeRows).toBeInTheDocument();
  });

  it('should display the row count', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, rowCount: 100 } });
    await act(async () => {
      render(<LakeRows isConsumption={'2023-11-01T20:28:39.179Z'} rowLimit={500} />);
    });
    await waitFor(() => screen.getByText(/100/i));
    expect(screen.getByText(/500/i)).toBeInTheDocument();
  });

  it('should display the total amount when rowLimit is greater than 0', async () => {
    api.get.mockResolvedValueOnce({ data: { success: true, rowCount: 100 } });
    await act(async () => {
      render(<LakeRows rowLimit={500} />);
    });
    await waitFor(() => screen.getByText(/500/i));
    expect(screen.getByText(/500/i)).toBeInTheDocument();
  });

});