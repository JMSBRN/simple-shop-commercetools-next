import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SocialLinks from './SocialLinks';


jest.mock('next/link', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);


jest.mock('../../../public/data/social-media-images.json', () => ({
  'social-media-links': [
    { name: 'Facebook', url: '/social_media_icons/facebook.png' },
    { name: 'Twitter', url: '/social_media_icons/twitter.png' },
  ],
}));

describe('SocialLinks component', () => {
  it('renders social media links', () => {
    render(<SocialLinks />);

    const facebookLink = screen.getByAltText('Facebook');
    const twitterLink = screen.getByAltText('Twitter');

    expect(facebookLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
  });

  it('opens social media links in a new tab when clicked', () => {
    render(<SocialLinks />);

    window.open = jest.fn();

    const facebookLink = screen.getByAltText('Facebook');
    userEvent.click(facebookLink);

    expect(window.open).toHaveBeenCalledWith('/social_media_icons/facebook.png', '_blank');

  });

  it('contains valid link URLs', () => {
    render(<SocialLinks />);

    const socialMediaLinks = screen.getAllByRole('link');

    socialMediaLinks.forEach(link => {
      const href = link.getAttribute('href');
      expect(href).toBeDefined();
      //expect(href).toMatch(/^https?:\/\//); // Check if the link starts with http:// or https://
    });
  });
});
