import React, { useEffect, useState } from 'react';
import {
  selectCommerceTools,
  setShoppingLists,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import Categories from '../categories/Categories';
import CountrySelect from '../country-select/CountrySelect';
import Image from 'next/image';
import LanguageSelect from '../language-select/LanguageSelect';
import Link from 'next/link';
import MiniCartModal from '../mini-cart-modal/MiniCartModal';
import { ShoppingList } from '@commercetools/platform-sdk';
import { getShoppingLists } from '@/commercetools/utils/utilsShoppingList';
import shoppingBasketIcon from '../../../public/icons/shopping_busket.png';
import styles from './Header.module.scss';

function Header() {
  const {
    headerContainer,
    logoStyle,
    categoriesContainer,
    shoppingBasketContainer,
    countShoppingLists,
  } = styles;

  const dispatch = useAppDispatch();
  const { shoppingLists } = useAppSelector(selectCommerceTools);
  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);

  useEffect(() => {
    const fetchFn = async () => {
      const res = (await getShoppingLists()) as ShoppingList[];

      dispatch(setShoppingLists(res));
    };

    fetchFn();
  }, [dispatch]);

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
      <div className={shoppingBasketContainer}>
        <div className={countShoppingLists}>
          {!!shoppingLists.length ? shoppingLists.length : ''}
        </div>
        <Image
          onClick={() => setIsModalRendered(true)}
          width={55}
          height={34}
          src={shoppingBasketIcon}
          alt="shopping basket"
        />
      </div>
      {isModalRendered && (
        <MiniCartModal
          onClick={() => setIsModalRendered(false)}
          shoppingLists={shoppingLists}
        />
      )}
    </header>
  );
}

export default Header;
