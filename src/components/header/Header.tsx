import Categories from '../categories/Categories';
import LanguageSelect from '../language-select/LanguageSelect';
import React from 'react';
import styles from './Header.module.scss';

function Header() {
  const { headerContainer, logoStyle } = styles;

  return (
    <header className={headerContainer}>
      <div className={logoStyle}>Store
       <div>international</div>
      </div>
      <Categories />
      <LanguageSelect />
    </header>
  );
}

export default Header;
