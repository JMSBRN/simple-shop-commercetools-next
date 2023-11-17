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
import { useTranslation } from 'next-i18next';

function MiniCartModal({ onClick }: { onClick: () => void }) {
  const {
    miniModalConTainer,
    miniModalClose,
    titleStyle,
    cartLineItemsStyle,
    buttonsContainer,
    total,
    subTotal,
  } = styles;
  const { carts } = useAppSelector(selectCommerceTools);
  const { push } = useRouter();
  const [cart, setCart] = useState<Cart>();
  const { t } = useTranslation('common');
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
        {t('close')}
      </div>
      <div className={titleStyle}>{t('miniCart')}</div>
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
            {t('subTotal')}: <OriginalTotal cart={cart} />
          </div>
          <div className={total}>
          {t('total')}:
            {cart?.taxedPrice &&
              getMoneyValueFromCartField(cart?.taxedPrice.totalGross)}
          </div>
          <div className={buttonsContainer}>
            <button onClick={handleRedirectToCartPage} type="button">
            {t('viewbag')}
            </button>
            <button type="button" onClick={handleCheckout}>
            {t('checkout')}
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
