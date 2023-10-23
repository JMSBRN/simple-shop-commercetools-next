import React, { useEffect } from 'react';
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
import { OriginalTotal } from '@/components/cart/original-sub-total/OriginalSubTotal';
import PaymentInfo from '@/components/payment-info/PaymentInfo';
import { UserData } from '@/interfaces';
import { deleteOrder } from '@/commercetools/utils/utilsOrders';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { fetchOrders } from '@/features/thunks/FetchOrders';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../../../styles/DashBoardPage.module.scss';
import { useRouter } from 'next/router';

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
    orderUserDataStyle,
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
          dispatch(fetchCarts({ email, password }));
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
        {carts
          .filter((c) => c.cartState === 'Active')
          .map((c) => (
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
            <div>Order Status : {o.orderState}</div>
            <div
              className="deleteOrderStyle"
              onClick={async () => {
                await deleteOrder(o.id, o.version);
                await deleteCart(o.cart?.id!);
                dispatch(fetchOrders());
                dispatch(fetchCarts());
                deleteCookieFromLocal('currentCartId');
              }}
            >
              {' '}
              delete Order
            </div>
            <br />
            <div className={orderUserDataStyle}>
              <div>
                <h4>Billing Data</h4>
                {Object.entries(o.billingAddress!).map(([key, value]) => (
                  <>
                    <span>{key} : </span>
                    <span>{value}</span>
                    <br />
                  </>
                ))}
              </div>
              <div>
                <h4>Shipping Data</h4>
                {Object.entries(o.shippingAddress!).map(([key, value]) => (
                  <>
                    <span>{key} : </span>
                    <span>{value}</span>
                    <br />
                  </>
                ))}
              </div>
            </div>
            <div>
              {o.lineItems.map((l) => (
                <div key={l.id}>
                  <CartLineItem
                    cartId={o.id}
                    version={o.version}
                    lineItem={l}
                    isDeleteBtnNotExisted={true}
                  />
                </div>
              ))}
            </div>
            <div>
              {o.paymentInfo?.payments.map((p) => (
                <div key={p.id}>
                  <div>
                    <PaymentInfo paymentId={p.id} />
                  </div>
                </div>
              ))}
            </div>
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
