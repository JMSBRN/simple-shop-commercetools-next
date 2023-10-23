import {
  Customer,
  Order,
  Payment,
  PaymentPagedQueryResponse,
} from '@commercetools/platform-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import {
  deleteCustomerWithId,
  getCustomers,
} from '@/commercetools/utils/utilsCustomers';
import { deleteOrder, getOrders } from '@/commercetools/utils/utilsOrders';
import { deletePayment, getPayments } from '@/commercetools/utils/utilsPayment';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import CartLineItem from '../cart/cart-line-item/CartLineItem';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { deleteCart } from '@/commercetools/utils/utilsCarts';
import { deleteCookieFromLocal } from '@/commercetools/utils/secureCookiesUtils';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const { carts } = useAppSelector(selectCommerceTools);
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>([] as Order[]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const fetchOrders = async () => {
    const res = (await getOrders()) as Order[];

    if (res.length) setOrders(res);
  };
  const fetchPayments = async () => {
    const { body } =
      (await getPayments()) as ClientResponse<PaymentPagedQueryResponse>;
    const { results } = body!;

    if (results) setPayments(results);
  };
  const fetchCustomers = useCallback(async () => {
    const res = (await getCustomers()) as Customer[];

    setCustomers(res);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchPayments();
    dispatch(fetchCarts());
  }, [dispatch, fetchCustomers]);

  return (
    <div className={styles.welcomePageContainer}>
      welcome page in develop mode
      <div>
        cards for delete
        {carts.map((el) => (
          <div key={el.id} style={{ cursor: 'pointer' }}>
            {el.id}
            <div
              onClick={async () => {
                await deleteCart(el.id);
                dispatch(fetchCarts());
                deleteCookieFromLocal('currentCartId');
              }}
            >
              {el.cartState}
            </div>
            <div className="">{el.createdBy?.clientId}</div>
            <div className="">
              {' '}
              payment id: {el.paymentInfo?.payments[0].id}
            </div>
            <div className=""> anonymousId: {el.anonymousId}</div>
            {el.lineItems.map((l) => (
              <div key={l.id}>
                <CartLineItem
                  cartId={el.id}
                  version={el.version}
                  lineItem={l}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        customers for delete
        {customers.map((el) => (
          <div
            key={el.id}
            onClick={async () => {
              const { id } = (await deleteCustomerWithId(
                el.id,
                el.version
              )) as Customer;

              if (id) fetchCustomers();
              deleteCookieFromLocal('userData');
            }}
            style={{ cursor: 'pointer' }}
          >
            {el.id}
            ------------
            <div>First Name: {el.firstName}</div>
            <div>Last Name: {el.lastName}</div>
            <div>Email: {el.email}</div>
            ------------
          </div>
        ))}
      </div>
      <div>
        orders for delete
        {orders.map((el) => (
          <div
            key={el.id}
            onClick={async () => {
              await deleteOrder(el.id, el.version);
              fetchOrders();
            }}
            style={{ cursor: 'pointer' }}
          >
            {el.id}
            <div className="">{el.orderState}</div>
            <div className="">{el.createdBy?.clientId}</div>
            <div className="">
              {' '}
              {el.lineItems.map((l) => (
                <div key={l.id}>
                  <CartLineItem
                    cartId={el.id}
                    version={el.version}
                    lineItem={l}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div>
        payments for delete
        {payments.map((el) => (
          <div
            key={el.id}
            onClick={async () => {
              await deletePayment(el.id, el.version);
              fetchPayments();
            }}
            style={{ cursor: 'pointer' }}
          >
            {el.id}
            <div className="">{el.paymentMethodInfo.method}</div>
            <div className="">{el.createdBy?.clientId}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default WelcomePage;
