import { Address } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import { FormType } from 'types';
import React from 'react';
import { TFunction } from 'i18next/typescript/t';

function CustomerInfoDisplay({
  customerInfo,
  t,
}: {
  customerInfo: CustomerInfo | Address;
  t: TFunction<'form', undefined>;
}) {
  return (
    <div>
      {Object.entries(customerInfo).map(([key, value]) => (
        <div key={key}>
          <div>
            {t(key as keyof FormType)} : <span>{value || 'no data'}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CustomerInfoDisplay;
