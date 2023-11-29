import React from 'react';
import { TaxedItemPrice } from '@commercetools/platform-sdk';
import { getMoneyValueFromCartField } from '@/commercetools/utils/utilsCarts';
import styles from './TotalAmount..module.scss';

function TotalAmount({
  isTotlaSummExisted,
  taxedPrice,
}: {
  isTotlaSummExisted: boolean;
  taxedPrice: TaxedItemPrice;
}) {
  return (
    <div className={styles.total}>
      {isTotlaSummExisted &&
        taxedPrice &&
        getMoneyValueFromCartField(taxedPrice?.totalGross!)}
    </div>
  );
}

export default TotalAmount;
