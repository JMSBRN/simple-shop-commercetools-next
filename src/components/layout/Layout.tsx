import Footer from '../footer/Footer';
import Header from '../header/Header';
import React  from 'react';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
import styles from './Layout.module.scss';
import useLeavePageConfirmation from '@/hooks/commercetools-hooks/useLeavePageConfirmation';

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  const currentCartId = JSON.parse(
    getDecryptedDataFromCookie('currentCartId')!
  ) as string | undefined;
 
  useLeavePageConfirmation({
    shouldStopNavigation: true,
    customPath: !!currentCartId ? `/cart/${currentCartId}` : undefined

  });

  return (
    <div className={styles.layoutContainer}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
