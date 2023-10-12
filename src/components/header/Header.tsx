import React, { useEffect, useState } from 'react';
import {
  deleteCookieFromLocal,
  getDecryptedDataFromCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import {
  selectCommerceTools,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import Categories from '../categories/Categories';
import CountrySelect from '../country-select/CountrySelect';
import Image from 'next/image';
import LanguageSelect from '../language-select/LanguageSelect';
import Link from 'next/link';
import MiniCartModal from '../mini-cart-modal/MiniCartModal';
import { UserData } from '@/interfaces';
import { deleteCart } from '@/commercetools/utils/utilsCarts';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import logoutIcon from '../../../public/svgs/logout.svg';
import shoppingBasketIcon from '../../../public/icons/shopping_busket.png';
import styles from './Header.module.scss';
import { useRouter } from 'next/router';

function Header() {
  const {
    headerContainer,
    logoStyle,
    categoriesContainer,
    shoppingBasketContainer,
    countShoppingLists,
    authContainer,
    loginBtnStyle,
    userNameStyle,
  } = styles;

  const [isModalRendered, setIsModalRendered] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { carts, userName } = useAppSelector(selectCommerceTools);
  const cart = carts?.find((el) => el.id) as Cart;
  const { push } = useRouter();

  useEffect(() => {
    const fn = async () => {
      dispatch(fetchCarts());
    };

    fn();
    const userdataFromLocal = JSON.parse(
      getDecryptedDataFromCookie('userData')!
    ) as UserData;

    if (userdataFromLocal?.firstName) {
      const { firstName } = userdataFromLocal;

      if (firstName) dispatch(setUserName(firstName));
    }
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(setUserName(''));
    deleteCookieFromLocal('userData');
    deleteCookieFromLocal('currentCartId');
    if (cart?.id) {
      const res = await deleteCart(cart.id);

      if (res?.statusCode === 200) push('/');
    }
    push('/');
  };

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
      <div className={authContainer}>
        {!userName ? (
          <div className={loginBtnStyle} onClick={() => push('/auth/login')}>
            Log In
          </div>
        ) : (
          <div className={userNameStyle}>
            <div>{userName}</div>
            <Image
              src={logoutIcon}
              alt="logout icon"
              width={25}
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
      {isModalRendered && (
        <MiniCartModal onClick={() => setIsModalRendered(false)} />
      )}
    </header>
  );
}

export default Header;
