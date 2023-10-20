import React, { useEffect, useState } from 'react';
import {
  deleteCart,
  getMoneyValueFromCartField,
} from '@/commercetools/utils/utilsCarts';
import {
  deleteCookieFromLocal,
  getDecryptedDataFromCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import CartLineItem from '@/components/cart/cart-line-item/CartLineItem';
import { GetServerSideProps } from 'next';
import { Order } from '@commercetools/platform-sdk';
import { OriginalTotal } from '@/components/cart/original-sub-total/OriginalSubTotal';
import { UserData } from '@/interfaces';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { getMyOrders } from '@/commercetools/utils/utilsMe';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../../styles/DashBoardPage.module.scss';
import { useRouter } from 'next/router';
import { fetchOrders } from '@/features/thunks/FetchOrders';

function DashBoard() {
  const {
    dashboardContainer,
    myCartsStyle,
    myCartStyle,
    cartLineItems,
    cartSubTotal,
    cartTotal,
    myOrdersStyle,
    topButtonsStyle,
  } = styles;
  const dispatch = useAppDispatch();
  const { carts, orders } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const userDataFromLocal = JSON.parse(
    getDecryptedDataFromCookie('userData')!
  ) as UserData;

  useEffect(() => {
    const fn = async () => {
      if (userDataFromLocal?.email) {
        const { email, password } = userDataFromLocal;

        if (email && password) {
          //dispatch(fetchCarts({ email, password }));
          dispatch(fetchOrders({ email, password }));
        }

      }
    };

    fn();
  }, [dispatch, userDataFromLocal]);

  const handleDeleteMyCart = async (cartId: string) => {
    const res = await deleteCart(cartId);

    if (res?.statusCode === 200) {
      dispatch(fetchCarts(userDataFromLocal));
      deleteCookieFromLocal('currentCartId');
    }
  };
  const handleCheckoutMyCart = async (cartId: string) => {
    push(`/checkout/${cartId}`);
  };
  const handleViewMyCart = async (cartId: string) => {
    push(`/cart/${cartId}`);
  };

  return (
    <div className={dashboardContainer}>
      <div className={myCartsStyle}>
        <h3>Active Carts</h3>
        {carts.filter(c => c.cartState === 'Active').map((c) => (
          <div className={myCartStyle} key={c.id}>
            <div className={topButtonsStyle}>
              <div onClick={() => handleDeleteMyCart(c.id)}>delete</div>
              <div onClick={() => handleCheckoutMyCart(c.id)}>checkout</div>
              <div onClick={() => handleViewMyCart(c.id)}>view</div>
            </div>
            <div className={cartLineItems}>
              {c.lineItems.map((l) => (
                <CartLineItem
                  cartId={c.id}
                  lineItem={l}
                  version={c.version}
                  key={l.id}
                  isQuantityButtonsExisted={true}
                  isTotlaSummExisted={true}
                />
              ))}
            </div>
            <div className={cartSubTotal}>
              Sub Total: <OriginalTotal cart={c} />
            </div>
            <div className={cartTotal}>
              Total:
              {c.taxedPrice &&
                getMoneyValueFromCartField(c.taxedPrice.totalGross)}
            </div>
          </div>
        ))}
      </div>
      <div className={myOrdersStyle}>
        <h3>Orders</h3>
        {orders.map((o) => (
          <div key={o.id}>
            <div className="">{o.id}</div>
            <div className="">{o.orderState}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashBoard;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en-GB', [
        'translation',
        'common',
      ])),
    },
  };
};
