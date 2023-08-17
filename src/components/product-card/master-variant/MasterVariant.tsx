import Image from 'next/image';
import Link from 'next/link';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../utilsProductCard';
import styles from './MasterVariant.module.scss';

function MasterVariant({
  masterVariant,
  productName,
}: {
  masterVariant: ProductVariant;
  productName: string;
}) {
  const {
    masterVariantContainer,
    productTitle,
    attributesStyle,
    pricesStyle,
    priceCurrencyStyle,
    priceCurrencyCodeStyle,
    ImageStyle,
    imageLayoutStyle
  } = styles;
  const { images, attributes, prices } = masterVariant;

  return (
    <div className={masterVariantContainer}>
      <div className={productTitle}>{productName}</div>
      <div className={imageLayoutStyle}>
      {images?.map((el) => (
        <Link key={el.url} href={el.url} target="blank">
          <Image
           className={ImageStyle}
            priority
            src={el.url}
            alt={el.label || 'product image'}
            width={el.dimensions.w}
            height={el.dimensions.h}
          />
        </Link>
      ))}
      </div>
      <div className={attributesStyle}>
        {attributes?.map((atr, idx) => (
          <div key={idx}>
            <div className="name">{atr.name}</div>
            <div className="label">{atr.value.label}</div>
          </div>
        ))}
      </div>
      <div className="description">{}</div>
      <div className={pricesStyle}>
        {prices?.map((price) => (
          <div key={price.id}>
            <div className={priceCurrencyStyle}>{formatValue(price.value)}</div>
            <div className={priceCurrencyCodeStyle}>
              {price.value.currencyCode}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MasterVariant;
