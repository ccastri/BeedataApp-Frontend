import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { LakeRows } from '../../../src/components/dashboard/lake-rows';
import api from '../../../src/lib/axios';

jest.mock('../../../src/lib/axios');

describe('LakeRows', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });


  it('should render the component', async () => {
    render(<LakeRows />);
    const lakeRows = screen.getByText(/Lake Rows/i);
    expect(lakeRows).toBeInTheDocument();
  });

  it('should fetch the row count from the API', async () => {
    const mockResponse = {
      data: {
        success: true,
        rowCount: 10,
      },
    };
    api.get.mockResolvedValue(mockResponse);
    render(<LakeRows />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/purchases/active', {
        headers: {
            Authorization: `Bearer ${null}`,
        },
    }));
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should fetch the row limit from the API', async () => {
    const mockResponse = {
      data: {
        success: true,
        active: [
          {
            db_rows_qty: 5,
          },
          {
            db_rows_qty: 10,
          },
        ],
      },
    };
    api.get.mockResolvedValue(mockResponse);
    render(<LakeRows />);
    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/api/v1/purchases/active', {
        headers: {
            Authorization: `Bearer ${null}`,
        },
    }));
    expect(screen.getByText(/15/i)).toBeInTheDocument();
  });
});