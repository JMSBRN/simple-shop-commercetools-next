import { Cart, LineItem } from '@commercetools/platform-sdk';
import {
  filterObjectAndReturnValue,
  getCurrencySymbol,
} from '@/commercetools/utils/utilsCommercTools';
import {
  getCarts,
  updateCartLineitemQuantity,
} from '@/commercetools/utils/utilsCarts';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import Image from 'next/image';
import LineItemTotalPrice from '../line-item-price/LineItemPrice';
import React from 'react';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { formatValue } from '@/components/product-card/utilsProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CartLineItem.module.scss';

function CartLineItem({
  cartId,
  lineItem,
  handleDeleteLineItem
}: {
  cartId: string;
  lineItem: LineItem;
  handleDeleteLineItem: (lineitemId: string) => Promise<void>
}) {
  const {
    lineItemStyle,
    deleteLineItem,
    description,
    descriptionInfoContainer,
    price,
    saleBage,
    quantityStyle,
    total,
  } = styles;
  const dispatch = useAppDispatch();
  const { country, language } = useAppSelector(selectCommerceTools);

  const { id, variant, name, quantity, productId } = lineItem;
  const { images, sku, prices } = variant;

  const handlePlusQuantity = async () => {
    const cart = (await getCarts(cartId)) as Cart;

    if (cart.id) {
      const { version } = cart;

      const res = await updateCartLineitemQuantity(
        cart.id,
        version,
        id,
        quantity + 1
      );

      if (res.id) dispatch(fetchCarts());
    }
  };
  const handleMinusQuantity = async () => {
    if (quantity > 1) {
      const cart = (await getCarts(cartId)) as Cart;

      if (cart.id) {
        const { version } = cart;

        const res = await updateCartLineitemQuantity(
          cart.id,
          version,
          id,
          quantity - 1
        );

        if (res.id) dispatch(fetchCarts());
      }
    }
  };

  return (
    <div className={lineItemStyle}>
      <div className={deleteLineItem} onClick={() => handleDeleteLineItem(id)}>delete</div>
      <div className={description}>
        <Image
          priority
          src={images?.find((el) => el.url)?.url!}
          width={100}
          height={160}
          alt="product image"
          style={{ width: '60%', height: 'auto' }}
        />
        <div className={descriptionInfoContainer}>
          <div>{filterObjectAndReturnValue(name, language)}</div>
          <div>{sku}</div>
        </div>
      </div>
      <div className={price}>
        {prices
          ?.filter((el) => el.country === country)
          .map((el) => {
            return `${formatValue(el.value)} ${getCurrencySymbol(
              country,
              el.value.currencyCode!
            )}`;
          })}
        {false && <div className={saleBage}>Sale</div>}
      </div>
      <div className={quantityStyle}>
        <button type="button" onClick={handlePlusQuantity}>
          +
        </button>
        <div>{quantity}</div>
        <button type="button" onClick={handleMinusQuantity}>
          -
        </button>
      </div>
      <div className={total}>
        <LineItemTotalPrice quantity={quantity} productId={productId} />
      </div>
    </div>
  );
}

export default CartLineItem;
