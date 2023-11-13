import Categories from '../categories/Categories';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import socialMediaImages from '../../../public/data/social-media-images.json';
import styles from './Footer.module.scss';
import { useTranslation } from 'next-i18next';

const Footer = () => {
  const { footer, logoStyle, container, section, socialLinks } = styles;
  const { t } = useTranslation('common');

  return (
    <footer className={footer}>
      <div className={container}>
        <div className={section}>
          <div className={logoStyle}>
            Store
            <div>international</div>
          </div>
          <p>
           {t('shopSlogan')}
          </p>
        </div>
        <div className={section}>
          <h3>{t('explore')}</h3>
          <Categories />
        </div>
        <div className={section}>
          <h3>{t('contactUsMessage')}</h3>
          <div className={socialLinks}>
            {socialMediaImages['social-media-links'].map((el) => (
              <div key={el.name}>
                <Link href="#" target="blank">
                  <Image width={80} height={80} src={el.url} alt={el.name} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
