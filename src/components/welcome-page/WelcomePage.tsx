import { Customer, Order, OrderPagedQueryResponse } from '@commercetools/platform-sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { deleteCustomerWithId, getCustomers } from '@/commercetools/utils/utilsCustomers';
import { deleteOrder, getOrders } from '@/commercetools/utils/utilsOrders';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { ClientResponse } from '@commercetools/sdk-client-v2';
import { deleteCart } from '@/commercetools/utils/utilsCarts';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const { carts } = useAppSelector(selectCommerceTools);
  const dispatch = useAppDispatch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  
  const fetchOrders = async () => {
    const { body } = await getOrders() as ClientResponse<OrderPagedQueryResponse>;
    const { results } = body!;
    
    if(results) setOrders(results);
  };
  const fetchCustomers = useCallback( async () => {
    const res = await getCustomers() as Customer[];

    setCustomers(res);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    dispatch(fetchCarts());
  }, [dispatch, fetchCustomers]);
  
  return (
    <div className={styles.welcomePageContainer}>welcome page in develop mode
    
       <div>
        cards for delete 
         {
          carts.map(el => (
            <div
            key={el.id}
            onClick={ async () => {
              await deleteCart(el.id, el.version);
              dispatch(fetchCarts());
            }}
            style={{ cursor: 'pointer' }}
            >{el.id}
             <div className="">{el.cartState}</div>
             <div className="">{el.createdBy?.clientId}</div>
             <div className=""> payment id: {el.paymentInfo?.payments[0].id}</div>
             <div className=""> anonymousId: {el.anonymousId}</div>
            </div>
          ))
         }
       </div>
       <div>
        customers for delete 
         {
          customers.map(el => (
            <div
            key={el.id}
            onClick={ async () => {
             const { id } =  await deleteCustomerWithId(el.id, el.version) as Customer;

             if(id) fetchCustomers();
            }}
            style={{ cursor: 'pointer' }}
            >{el.id}
            ------------
             <div >First Name: {el.firstName}</div>
             <div >Last Name: {el.lastName}</div>
             <div >Email: {el.email}</div>
            ------------
            </div>
          ))
         }
       </div>
       <div>
        orders for delete 
         {
          orders.map(el => (
            <div
            key={el.id}
            onClick={ async () => {
              await deleteOrder(el.id, el.version);
              fetchOrders();
            }}
            style={{ cursor: 'pointer' }}
            >{el.id}
             <div className="">{el.orderState}</div>
             <div className="">{el.createdBy?.clientId}</div>
            </div>
          ))
         }
       </div>
    </div>
  );
}
export default WelcomePage;

