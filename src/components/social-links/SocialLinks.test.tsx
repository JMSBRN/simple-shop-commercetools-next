import React from 'react';
import { render } from '@testing-library/react';
import SocialLinks from './SocialLinks';

jest.mock('../../../public/data/social-media-images.json', () => ({
  'social-media-links': [
    { name: 'Facebook', url: '/social_media_icons/facebook.png' },
    { name: 'Twitter', url: '/social_media_icons/twitter.png' },
  ],
}));

describe('SocialLinks component', () => {
  const renderSocialLinks = () => {
    const { getByAltText, getAllByRole } = render(<SocialLinks />);
    const facebookLink = getByAltText('Facebook');
    const twitterLink = getByAltText('Twitter');
    const socialMediaLinks = getAllByRole('link');
    return {
      facebookLink,
      twitterLink,
      socialMediaLinks
    }
  };

  test('renders social media links', () => {
    const { facebookLink, twitterLink } = renderSocialLinks();
    expect(facebookLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();
  });

  test('has defined href attribute for social media links', () => {
    const { socialMediaLinks } = renderSocialLinks();
    socialMediaLinks.forEach(link => {
      const href = link.getAttribute('href');
      expect(href).toBeDefined();
    });
  });
});