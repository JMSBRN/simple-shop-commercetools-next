import { Languages } from '@/interfaces';
import { LocalizedString } from '@commercetools/platform-sdk';
import React from 'react';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import styles from './ProductDescription.module.scss';

function ProductDescription({
  name,
  language,
}: {
  name: LocalizedString;
  language: Languages;
}) {
  const { description } = styles;

  return (
    <div className={description}>
      <div>{filterObjectAndReturnValue(name, language)}</div>
    </div>
  );
}

export default ProductDescription;
