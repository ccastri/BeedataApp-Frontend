import { jsx } from '@emotion/react';
import React from 'react';
import { render } from '@testing-library/react';
import { BeeCard } from '../../../src/components/login/side-card';

const viewports = [
  { width: 320, height: 480 }, // iPhone 5/SE
  { width: 360, height: 640 }, // Pixel 2
  { width: 375, height: 667 }, // iPhone 6/7/8
  { width: 414, height: 736 }, // iPhone 6/7/8 Plus
  { width: 768, height: 1024 }, // iPad
  { width: 1024, height: 768 }, // iPad landscape
  { width: 1280, height: 800 }, // Laptop
  { width: 1440, height: 900 }, // Laptop
  { width: 1920, height: 1080 }, // Desktop
  { width: 2560, height: 1440 }, // Desktop
];

/*
Test Suite for BeeCard component

Test cases:
- renders card content correctly
- applies correct styles
- renders the image correctly
- has the correct padding
*/

describe.each(viewports)('BeeCard (%p)', (viewport) => {
  beforeEach(() => {
    // set viewport size for the test
    Object.defineProperty(window, 'innerWidth', {
      value: viewport.width,
      writable: true,
    });
    Object.defineProperty(window, 'innerHeight', {
      value: viewport.height,
      writable: true,
    });
    window.dispatchEvent(new Event('resize'));
  });

  it(`renders card content correctly`, () => {
      const { getByText } = render(<BeeCard />);
      expect(getByText('EMPOWER YOUR BUSINESS WITH AI ASSISTANTS')).toBeInTheDocument();
      expect(getByText('We provide AI assistants with personalities tailored to your business needs.')).toBeInTheDocument();
  });

  it(`applies correct styles`, () => {
    const { container } = render(<BeeCard />);
    expect(container.firstChild).toHaveStyle('borderRadius: 16px');
    expect(container.firstChild).toHaveStyle('background: linear-gradient(147deg, #00337C 0%, #1C82AD 65%)');   
    expect(container.firstChild).toHaveStyle('boxShadow: 0px 0px 32px rgba(255, 255, 255, 0.3)');
    expect(container.firstChild).toHaveStyle('display: flex');
  });

  it('renders the image correctly', () => {
    const { getByRole } = render(<BeeCard />);
    const image = getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveStyle('background-image: url(/static/beet_nb.svg);');
  });

  it('has the correct padding', () => {
    const { container } = render(<BeeCard />);
    expect(container.firstChild).toHaveStyle('padding-bottom: 16px');
  });
});

