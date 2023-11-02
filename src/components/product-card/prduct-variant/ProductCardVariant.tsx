import Image from "next/legacy/image";
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../../../commercetools/utils/utilsProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductCardVariant.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function ProductCardVariant({ variant }: { variant: ProductVariant }) {
  const {
    variantContainerStyle,
    pricesStyle,
    priceCurrencyStyle,
    imageLayout,
    noPriceMessage
  } = styles;
  const { country } = useAppSelector(selectCommerceTools);

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
      <div className={pricesStyle}>
        {variant.prices?.filter((el) => el.country === country).length ? (
          variant.prices
            ?.filter((el) => el.country === country)
            .map((price) => (
              <div key={price.id}>
                <div className={priceCurrencyStyle}>
                {`${formatValue(price.value)} ${price.value.currencyCode}`}
                </div>
              </div>
            ))
        ) : (
          <div className={noPriceMessage}>
            no price in this country
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardVariant;
