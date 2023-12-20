import { TaxedItemPrice, TaxedPrice } from '@commercetools/platform-sdk';
import React from 'react';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import styles from './TotalAmount..module.scss';

function TotalAmount({
  taxedPrice,
  text,
  style,
}: {
  taxedPrice: TaxedItemPrice | TaxedPrice;
  text?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div style={style} className={styles.total}>
      {text}
      {taxedPrice && getMoneyValueFromCartField(taxedPrice.totalGross!)}
    </div>
  );
}

export default TotalAmount;
