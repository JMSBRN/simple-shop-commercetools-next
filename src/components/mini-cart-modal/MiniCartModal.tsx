import { useEffect, useState } from 'react';
import ButtonWithLoader from '../buttons/buttonWithLoader/ButtonWithLoader';
import { Cart } from '@commercetools/platform-sdk';
import CartLineItems from '../cart/cart-lineItems/CartLineItems';
import { OriginalTotal } from '../cart/original-sub-total/OriginalSubTotal';
import TotalAmount from '../product/total-amount/TotalAmount';
import { getDecryptedDataFromCookie } from '@/commercetools/utils/secureCookiesUtils';
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
    lineItemsWrapper,
    buttonsContainer,
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
  const totalInlineStyle: React.CSSProperties = {
    marginTop: '20px',
    marginRight: '10px',
    width: '100%',
    height: '30px',
    padding: '2px 8px',
    textAlign: 'end',
    color: 'lightgray',
  };

  return (
    <div data-testid="mini-cart" className={miniModalConTainer}>
      <div className={miniModalClose} onClick={onClick}>
        {t('close')}
      </div>
      <div className={titleStyle}>{t('miniCart')}</div>
      {cart?.lineItems.length && cart?.cartState === 'Active' ? (
        <>
        <div className={lineItemsWrapper}>
          <CartLineItems withTotalSumm={false} cart={cart} />
        </div>
          <div className={subTotal}>
            {t('subTotal')}: <OriginalTotal cart={cart} />
          </div>
          <TotalAmount
            taxedPrice={cart?.taxedPrice!}
            text={t('total')}
            style={totalInlineStyle}
          />
          <div className={buttonsContainer}>
            <ButtonWithLoader
              onClick={handleRedirectToCartPage}
              text={t('viewbag')}
            />
            <ButtonWithLoader onClick={handleCheckout} text={t('checkout')} />
          </div>
        </>
      ) : (
        <div>Empty Cart</div>
      )}
    </div>
  );
}

export default MiniCartModal;
