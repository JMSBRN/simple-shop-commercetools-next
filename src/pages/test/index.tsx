import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { deleteCart } from '@/commercetools/utils/utilsCarts';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';

function Test() {
  const { carts } = useAppSelector(selectCommerceTools);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCarts());
  }, [dispatch]);

  const handleDeleteCart = async (cartId: string) => {
    const res = await deleteCart(cartId);

    if (res) dispatch(fetchCarts());
  };

  return (
    <div>
      <div className="">
        Carts
        <div>
          {carts.length ? carts.map((c) => (
            <div key={c.id}>
              <div
                style={{ cursor: 'pointer', fontSize: '18px' }}
                onClick={() => handleDeleteCart(c.id)}
              >
                Delete cart with id : {c.id}
              </div>
              <div>customerId : {c.customerId}</div>
              <div>anonymousId : {c.anonymousId}</div>
            </div>
          )) : (
            <div className="">
              <br />
              <br />
              <br />
              <br />
            No carts</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Test;
