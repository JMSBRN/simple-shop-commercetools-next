import { Order, OrderPagedQueryResponse } from '@commercetools/platform-sdk';
import React, { useEffect, useState } from 'react';
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
  
  const fetchOrders = async () => {
    const { body } = await getOrders() as ClientResponse<OrderPagedQueryResponse>;
    const { results } = body!;
    
    if(results) setOrders(results);
  };

  useEffect(() => {
    fetchOrders();
    dispatch(fetchCarts());
  }, [dispatch]);
  
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
