import LanguageSelect from '../language-select/LanguageSelect';
import React from 'react';
import styles from './Header.module.scss';

function Header() {
  const { headerContainer } = styles;

  return (
    <header className={headerContainer}>
      <div className="">Shop Logo</div>
      <div className="">Location</div>
      <LanguageSelect />
    </header>
  );
}

export default Header;
