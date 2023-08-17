import Image from 'next/image';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../utilsProductCard';
import styles from './ProductCardVariant.module.scss';

function ProductCardVariant({ variant }: { variant: ProductVariant }) {
  const {
    variantContainerStyle,
    attributesStyle,
    pricesStyle,
    priceCurrencyStyle,
    priceCurrencyCodeStyle,
    imageLayout
  } = styles;

  return (
    <div className={variantContainerStyle}>
      <div className={imageLayout}>
      {variant.images?.map((image, idx) => (
        <Image
          priority
          key={idx.toString()}
          src={image.url}
          width={image.dimensions.w}
          height={image.dimensions.h}
          alt={image.label || 'alt not exist sorry for that'}
        />
      ))}
      </div>
      <div className={attributesStyle}>
        {variant.attributes?.map((atr, idx) => (
          <div key={idx}>
            <div className="name">{atr.name}</div>
            <div className="label">{atr.value.label}</div>
          </div>
        ))}
      </div>
      <div className={pricesStyle}>
        {variant.prices?.map((price) => (
            <div key={price.id}>
              <div className={priceCurrencyStyle}>
                {formatValue(price.value)}
              </div>
              <div className={priceCurrencyCodeStyle}>
                {price.value.currencyCode}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductCardVariant;
