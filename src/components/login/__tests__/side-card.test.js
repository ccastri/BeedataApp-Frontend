import { jsx } from '@emotion/react';
import React from 'react';
import { render } from '@testing-library/react';
import { BeeCard } from '../side-card';

describe('BeeCard', () => {
    it('renders the card content correctly', () => {
      const { getByText } = render(<BeeCard />);
      expect(getByText('CONNECT TO THE WORLD OF AUTOMATED SERVICES')).toBeInTheDocument();
      expect(getByText('Our cloud-based platform allows you to access and share relevant data anytime, anywhere.')).toBeInTheDocument();
    });
    
    it('has the correct styles applied', () => {
        const { container } = render(<BeeCard />);
        expect(container.firstChild).toHaveStyle('borderRadius: 16px');
        expect(container.firstChild).toHaveStyle('background: linear-gradient(147deg, #00337C 0%, #1C82AD 65%)');
      });
    
    it('renders the image correctly', () => {
        const { getByRole } = render(<BeeCard />);
        const image = getByRole('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveStyle('background-image: url(/static/logo-beedata.png);');
    });
      
  });
