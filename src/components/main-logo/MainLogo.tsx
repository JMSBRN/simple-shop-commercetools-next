import React from 'react';
import styles from './MainLogo.module.scss';

function MainLogo() {
  return (
    <div data-testid="main-logo" className={styles.logoStyle}>
    Store
    <div>international</div>
  </div>
  );
}

export default MainLogo;
