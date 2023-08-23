import Footer from '../footer/Footer';
import Header from '../header/Header';
import React from 'react';
import styles from './Layout.module.scss';

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.layoutContainer}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
