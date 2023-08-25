import Categories from '../categories/Categories';
import CountrySelect from '../country-select/CountrySelect';
import LanguageSelect from '../language-select/LanguageSelect';
import Link from 'next/link';
import React from 'react';
import styles from './Header.module.scss';

function Header() {
  const { headerContainer, logoStyle, categoriesContainer } = styles;

  return (
    <header className={headerContainer}>
      <CountrySelect />
      <Link href={'/'}>
        <div className={logoStyle}>
          Store
          <div>international</div>
        </div>
      </Link>
      <div className={categoriesContainer}>
       <Categories />
      </div>
      <LanguageSelect />
    </header>
  );
}

export default Header;
