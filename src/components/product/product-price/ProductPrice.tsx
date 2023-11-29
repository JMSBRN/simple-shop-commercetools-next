import { Price } from '@commercetools/platform-sdk';
import React from 'react';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import styles from './ProductPrice.module.scss';

function ProductPrice({ price }: { price: Price }) {
  const { priceStyle, saleBage } = styles;

  return (
    <div className={priceStyle}>
      {getMoneyValueFromCartField(price.value)}
      {false && <div className={saleBage}>Sale</div>}
    </div>
  );
}

export default ProductPrice;
