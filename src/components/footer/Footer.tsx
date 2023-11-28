import Categories from '../categories/Categories';
import MainLogo from '../main-logo/MainLogo';
import styles from './Footer.module.scss';
import { useTranslation } from 'next-i18next';
import SocialLinks from '../social-links/SocialLinks';

const Footer = () => {
  const { footer, container, section } = styles;
  const { t } = useTranslation('common');

  return (
    <footer data-testid="footer" className={footer}>
      <div className={container}>
        <div className={section}>
          <MainLogo />
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
           <SocialLinks />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
