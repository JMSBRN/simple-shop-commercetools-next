import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Cart } from '@commercetools/platform-sdk';
import CartTotalSum from '../cart/total-summ/CartTotalSumm';
import ProductPrice from '../product-card/product-price/ProductPrice';
import React from 'react';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { removeLineItemfromCart } from '@/commercetools/utils/utilsCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './OrderSummary.module.scss';
import { useRouter } from 'next/router';

function OrderSummary({
  cart,
  handlePlaceOrder,
}: {
  cart: Cart;
  handlePlaceOrder: () => void;
}) {
  const {
    orderSummaryStyle,
    totalsInfo,
    totalsInfoTitles,
    lineItemsStyle,
    subTotal,
    shippingModeContainer,
    paymentMethodContainer,
    totalSum,
    checkoutBtn,
    errors,
    listItem,
    itemDelete,
    itemName,
    itemPrice
  } = styles;

  const dispatch = useAppDispatch();
  const { carts } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const handleDeleteLineItem = async (
    ID: string,
    version: number,
    lineitemId: string
  ) => {
    const res = await removeLineItemfromCart(ID, version, lineitemId);

    if (res.statusCode === 200) {
      dispatch(fetchCarts());
    }
    if (cart?.lineItems.length === 1) {
      push('/');
    }
  };
  
  return (
    <div className={orderSummaryStyle}>
      <div className={totalsInfo}>
        <div className={totalsInfoTitles}>
          <span>product</span>
          <span>total</span>
        </div>
        <div className={lineItemsStyle}>
         {cart.lineItems.map(item => (
                  <div className={listItem} key={item.id}>
                  <div
                    className={itemDelete}
                    onClick={() =>
                      handleDeleteLineItem(cart.id, cart.version, item.id)
                    }
                  >
                    delete
                  </div>
                  <div className={itemName}>
                    {filterObjectAndReturnValue(item.name, 'en') ||
                      'no product name'}
                  </div>
                  <div className={itemPrice}>
                    <ProductPrice
                      quantity={item.quantity}
                      productId={item.productId}
                    />
                  </div>
                </div>
         ))}
        </div>
        <div className={subTotal}>
          Total: <CartTotalSum carts={carts} />
        </div>
      </div>
      <div className={shippingModeContainer}>
        shipping mode
        <label>
          <input type="radio" />
          <input type="radio" />
        </label>
      </div>
      <div className={paymentMethodContainer}>
        <label>
          paymentMethod
          <input type="radio" />
          <input type="radio" />
        </label>
      </div>
      <div className={totalSum}>
      Total: <CartTotalSum carts={carts} />
      </div>
      <button className={checkoutBtn} onClick={handlePlaceOrder}>
        Placeorder
      </button>
      <div className={errors}>error</div>
    </div>
  );
}

export default OrderSummary;
