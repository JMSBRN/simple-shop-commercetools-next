import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import Categories from '../categories/Categories';
import CountrySelect from '../country-select/CountrySelect';
import Image from 'next/image';
import LanguageSelect from '../language-select/LanguageSelect';
import Link from 'next/link';
import MiniCartModal from '../mini-cart-modal/MiniCartModal';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
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

  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const cart = carts?.find((el) => el.id) as Cart;

  useEffect(() => {
    const fn = async () => {
      dispatch(fetchCarts());
    };

    fn();
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
          {cart ? cart.totalLineItemQuantity : ''}
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
        <MiniCartModal onClick={() => setIsModalRendered(false)} />
      )}
    </header>
  );
}

export default Header;
