import ButtonWithLoader from '../../buttons/buttonWithLoader/ButtonWithLoader';
import { Cart } from '@commercetools/platform-sdk';
import CartLineItems from '../cart-lineItems/CartLineItems';
import CartTotalsContainer from '../cart-totals-container/CartTotalsContainer';
import Headlines from '../headlines/Headlines';
import styles from './CustomerCart.module.scss';
import { useTranslation } from 'next-i18next';

function CustomerCart({ cart }: { cart: Cart }) {
  const {
    cartContainer,
    cartTitle,
    mainContainer,
    leftSideContainer,
    lineItemsWrapperStyle,
    promoCodeContainer,
  } = styles;
  const { t } = useTranslation('common');
  const headlines = [
    '',
    t('description'),
    t('price'),
    t('quantity'),
    t('total'),
  ];

  return (
    <div className={cartContainer}>
      <div className={cartTitle}>
        <h3>{t('customerCart')}</h3>
      </div>
      <div className={mainContainer}>
        <div className={leftSideContainer}>
          <Headlines headlines={headlines} />
          <div className={lineItemsWrapperStyle}>
            <CartLineItems cart={cart} withTotalSumm={true} />
          </div>
          <div className={promoCodeContainer}>
            <input type="text" placeholder={t('promoCode')} />
            <ButtonWithLoader text={t('apply')} onClick={() => {}} />
          </div>
        </div>
        <CartTotalsContainer cart={cart} />
      </div>
    </div>
  );
}

export default CustomerCart;
