import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { deleteCart } from '@/commercetools/utils/utilsCarts';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './WelcomePage.module.scss';

function WelcomePage() {
  const { carts } = useAppSelector(selectCommerceTools);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
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
            </div>
          ))
         }
       </div>
    </div>
  );
}
export default WelcomePage;
