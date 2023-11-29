import ButtonWithLoader from '../buttons/buttonWithLoader/ButtonWithLoader';
import { Cart } from '@commercetools/platform-sdk';
import CartLineItem from './cart-line-item/CartLineItem';
import CartTotalsContainer from './cart-totals-container/CartTotalsContainer';
import styles from './CustomerCart.module.scss';
import { useTranslation } from 'next-i18next';

function CustomerCart({ cart }: { cart: Cart }) {
  const {
    cartContainer,
    cartTitle,
    mainContainer,
    leftSideContainer,
    lineItemsStyle,
    promoCodeContainer,
    lineItemHeadlines,
  } = styles;
  const { t } = useTranslation('common');
  const headlines = ['', t('description'), t('price'), t('quantity'), t('total')];

  return (
    <div className={cartContainer}>
      <div className={cartTitle}>
        <h3>{t('customerCart')}t</h3>
      </div>
      <div className={mainContainer}>
        <div className={leftSideContainer}>
          <div className={lineItemHeadlines}>
          {headlines.map((el, idx) => (
        <div key={idx}>{el}</div>
      ))}
          </div>
          <div className={lineItemsStyle}>
            {cart.lineItems.map((el) => (
              <CartLineItem
                cartId={cart?.id}
                key={el.id}
                lineItem={el}
                isQuantityButtonsExisted={true}
                isTotlaSummExisted={true}
              />
            ))}
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
