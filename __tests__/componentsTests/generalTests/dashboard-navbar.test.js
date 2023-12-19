import React from 'react';
import Cookies from 'js-cookie';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DashboardNavbar } from '../../../src/components/general/dashboard-navbar';

jest.mock('js-cookie', () => ({
    get: jest.fn()
}));

describe('Dashboard Navbar', () => {
});
