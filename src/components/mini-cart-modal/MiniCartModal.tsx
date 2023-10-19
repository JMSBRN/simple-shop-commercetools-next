import { useEffect, useState } from 'react';
import { Cart } from '@commercetools/platform-sdk';
import CartLineItem from '../cart/cart-line-item/CartLineItem';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './MiniCartModal.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useRouter } from 'next/router';

function MiniCartModal({ onClick }: { onClick: () => void }) {
  const {
    miniModalConTainer,
    miniModalClose,
    titleStyle,
    cartLineItemsStyle,
    buttonsContiner,
    total,
    subTotal,
  } = styles;
  const { carts } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const [cart, setCart] = useState<Cart>();
  const currentCartId = JSON.parse(
    getDecryptedDataFromCookie('currentCartId')!
  ) as string | undefined;

  useEffect(() => {
    if (currentCartId) {
      const cart = carts.find((c) => c.id === currentCartId);

      if (cart?.id) setCart(cart);
    }
  }, [cart, carts, currentCartId]);

  const handleRedirectToCartPage = async () => {
    if (cart?.id && cart?.lineItems.length) {
      onClick();
      push(`/cart/${cart.id}`);
    }
  };
  const handleCheckout = async () => {
    onClick();
    if (cart?.lineItems.length) {
      push(`/checkout/${cart.id}`);
    }
  };

  return (
    <div className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        close
      </div>
      <div className={titleStyle}>Mini Cart</div>
      {cart?.lineItems.length && cart?.cartState === 'Active' ? (
        <>
          <div className={cartLineItemsStyle}>
            {cart?.id &&
              cart?.lineItems.map((item) => (
                <CartLineItem
                  key={cart?.id}
                  cartId={cart?.id}
                  lineItem={item}
                  version={cart?.version}
                />
              ))}
          </div>
          <div className={subTotal}>
            Sub Total: <OriginalTotal cart={cart} />
          </div>
          <div className={total}>
            Total:
            {cart?.taxedPrice &&
              getMoneyValueFromCartField(cart?.taxedPrice.totalGross)}
          </div>
          <div className={buttonsContiner}>
            <button onClick={handleRedirectToCartPage} type="button">
              Viewbag
            </button>
            <button type="button" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </>
      ) : (
        <div>Empty Cart</div>
      )}
    </div>
  );
}

export default MiniCartModal;
