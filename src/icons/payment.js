import React from 'react';
import { createSvgIcon } from '@mui/material/utils';

export const Payment = createSvgIcon(
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path 
      fillRule="evenodd"
      d="M18 6V4H2v2h16zm0 4H2v6h16v-6zM0 4c0-1.1.9-2 2-2h16a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm4 8h4v2H4v-2z"
      clipRule="evenodd"
    />
  </svg>,
  'Payment'
);