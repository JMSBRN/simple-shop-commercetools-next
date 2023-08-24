import Categories from '../categories/Categories';
import LanguageSelect from '../language-select/LanguageSelect';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';

function Header() {
  const { headerContainer, logoStyle } = styles;

  return (
    <header className={headerContainer}>
      <Link href={'/'}>
        <div className={logoStyle}>
          Store
          <div>international</div>
        </div>
      </Link>
      <Categories />
      <LanguageSelect />
    </header>
  );
}

export default Header;
