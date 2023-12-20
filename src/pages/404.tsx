import { Trans, useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../styles/NotFound.module.scss';

function NotFound() {
  const { t } = useTranslation('translation');

  return (
    <div className={styles.notFoundContainer}>
      <div>
        {t('notFoundMessage')}
        <Trans
          i18nKey="homeLink"
          t={t}
          components={[<Link href={'/'} key={'1'} />]}
        />
      </div>
    </div>
  );
}

export default NotFound;
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['translation', 'common'])),
    },
  };
};
