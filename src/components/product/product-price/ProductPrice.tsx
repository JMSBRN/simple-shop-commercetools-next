import { Price } from '@commercetools/platform-sdk';
import React from 'react';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import styles from './ProductPrice.module.scss';

function ProductPrice({ price }: { price: Price }) {
  return (
    <div className={styles.priceStyle}>
      {getMoneyValueFromCartField(price.value)}
    </div>
  );
}

export default ProductPrice;
