import Image from 'next/legacy/image';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../../../commercetools/utils/utilsProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductCardVariant.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useTranslation } from 'next-i18next';

function ProductCardVariant({ variant }: { variant: ProductVariant }) {
  const {
    variantContainerStyle,
    pricesStyle,
    priceCurrencyStyle,
    imageLayout,
    noPriceMessage,
  } = styles;
  const { country } = useAppSelector(selectCommerceTools);
  const { t } = useTranslation('common');

  return (
    <div className={variantContainerStyle}>
      <div className={imageLayout}>
        {variant.images?.map((image, idx) => (
          <Image
            priority
            key={idx.toString()}
            src={image.url}
            width={image.dimensions.w / 2}
            height={image.dimensions.h / 2}
            alt={image.label || t('no-exist-alt-img')}
            layout="fixed"
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
          <div className={noPriceMessage}>{t('no-price-message')}</div>
        )}
      </div>
    </div>
  );
}

export default ProductCardVariant;
