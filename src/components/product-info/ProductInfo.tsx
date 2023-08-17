import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@commercetools/platform-sdk';
import ProductVariant from '../product-card/prduct-variant/ProductVariant';
import React from 'react';
import { formatValue } from '../product-card/utilsProductCard';
import styles from './ProductInfo.module.scss';

function ProductInfo({ product }: { product: Product }) {
  const {
    productInfoContainer,
    originStyle,
    productTitle,
    attributesStyle,
    pricesStyle,
    priceCurrencyStyle,
    priceCurrencyCodeStyle,
    variantsStyle,
  } = styles;
  const { current, staged } = product.masterData;
  const { masterVariant, variants } = current;
  const { images, attributes, prices } = masterVariant;
  const { name } = staged;
  const productName = Object.values(name)[0];

  return (
    <div className={productInfoContainer}>
      <div className={originStyle}>
        <div className={productTitle}>{productName}</div>
        {images?.map((el) => (
            <Link key={el.url}  href={el.url} target='blank'>
                <Image
                  priority
                  src={el.url}
                  alt={el.label || 'product image'}
                  width={300}
                  height={300 * 1.618}
                />
            </Link>
        ))}
        <div className={attributesStyle}>
          {attributes?.map((atr, idx) => (
            <div key={idx}>
              <div className="name">{atr.name}</div>
              <div className="label">{atr.value.label}</div>
            </div>
          ))}
        </div>
        <div className={pricesStyle}>
          {prices
            ?.filter((el) => el.country === 'US')
            .map((price) => (
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
      <div className={variantsStyle}>
        {variants.map((el) => (
          <ProductVariant key={el.id} variant={el} />
        ))}
      </div>
    </div>
  );
}

export default ProductInfo;
