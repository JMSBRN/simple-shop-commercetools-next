import { Cart, Order } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
import { getMyCarts, getMyOrders } from '@/commercetools/utils/utilsMe';
import CartLineItem from '@/components/cart/cart-line-item/CartLineItem';
import { GetServerSideProps } from 'next';
import { OriginalTotal } from '@/components/cart/original-sub-total/OriginalSubTotal';
import { UserData } from '@/interfaces';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../../styles/DashBoardPage.module.scss';

function DashBoard() {
  const {
    dashboardContainer,
    myCartsStyle,
    myCartStyle,
    cartLineItems,
    cartSubTotal,
    cartTotal,
    myOrdersStyle,
  } = styles;
  const [myCarts, setMyCarts] = useState<Cart[]>([]);
  const [myOrders, setMyOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fn = async () => {
      const userDataFromLocal = JSON.parse(
        getDecryptedDataFromCookie('userData')!
      ) as UserData;

      if (userDataFromLocal?.email) {
        const { email, password } = userDataFromLocal;
        const resMycarts = (await getMyCarts(email, password!)) as Cart[];
        const resMyOrders = (await getMyOrders(email, password!)) as Order[];

        if (resMycarts.length) {
          setMyCarts(resMycarts);
        }
        if (resMyOrders.length) {
          setMyOrders(resMyOrders);
        }
      }
    };

    fn();
  }, []);

  return (
    <div className={dashboardContainer}>
      <div className={myCartsStyle}>
        <h3>Active Carts</h3>
        {myCarts.map((c) => (
          <div className={myCartStyle} key={c.id}>
            <div>{c.cartState}</div>
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
        {myOrders.map((o) => (
          <div key={o.id}></div>
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
