import React, { useEffect, useState } from 'react';
import {
  deleteAllCookiesFromLocal,
  getDecryptedDataFromCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import {
  selectCommerceTools,
  setErrorMessage,
  setUserName,
} from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import Categories from '../categories/Categories';
import CountrySelect from '../country-select/CountrySelect';
import Image from 'next/legacy/image';
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
import { useTranslation } from 'next-i18next';

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
  const currentCartId = JSON.parse(
    getDecryptedDataFromCookie('currentCartId')!
  ) as string | undefined;
  const cart = carts?.find((el) => el.id === currentCartId!) as Cart;
  const { push } = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    dispatch(fetchCarts());
    const userdataFromLocal = JSON.parse(
      getDecryptedDataFromCookie('userData')!
    ) as UserData;

    if (userdataFromLocal?.firstName) {
      const { firstName } = userdataFromLocal;

      if (firstName) dispatch(setUserName(firstName));
    }
  }, [dispatch]);

  useEffect(() => {
    const fn = async () => {
      if (!currentCartId && carts.length) {
        const promises = carts.map(async (c) => {
          if (c.customerId === undefined) {
            return await deleteCart(c.id);
          }
        });

        await Promise.all(promises);
      }
    };

    fn();
  }, [carts, currentCartId]);

  const handleLogout = async () => {
    dispatch(setUserName(''));
    deleteAllCookiesFromLocal(['currentCartId', 'userData']);
    if (cart?.id) {
      const res = await deleteCart(cart.id);

      if (res) push('/');
    }
    push('/');
  };

  const handleLogin = () => {
    dispatch(setErrorMessage(''));
    push('/auth/login');
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
          {cart?.cartState === 'Active' ? cart.totalLineItemQuantity : ''}
        </div>
        <Image
          onClick={() => setIsModalRendered(true)}
          width={55}
          height={34}
          src={shoppingBasketIcon}
          alt="shopping basket"
          layout='fixed'
        />
      </div>
      <div className={authContainer}>
        {!userName ? (
          <div className={loginBtnStyle} onClick={handleLogin}>
            {t('login')}
          </div>
        ) : (
          <div className={userNameStyle}>
            <div>{userName}</div>
            <Image
              src={logoutIcon}
              alt="logout icon"
              width={25}
              onClick={handleLogout}
              layout='fixed'
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
