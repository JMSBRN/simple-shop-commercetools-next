import Atributes from '../atributes/Atributes';
import Image from 'next/legacy/image';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../../../commercetools/utils/utilsProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductCardVariant.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useTranslation } from 'next-i18next';

function ProductCardVariant({
  variant,
  productName,
  isMastervariantExisted,
}: {
  variant: ProductVariant;
  productName?: string;
  isMastervariantExisted?: boolean;
}) {
  const {
    variantContainerStyle,
    productTitle,
    pricesStyle,
    priceCurrencyStyle,
    attributesStyle,
    noPriceMessage,
  } = styles;
  const { country } = useAppSelector(selectCommerceTools);
  const { t } = useTranslation('common');

  return (
    <div className={variantContainerStyle}>
      <div className={productTitle}>{productName || ''}</div>
      <div>
        {variant.images?.map((image, idx) => (
          <Image
            priority
            key={idx.toString()}
            src={
              image.url || {
                src: '/images/No-Image-Placeholder.svg',
                width: 10,
                height: 10,
              }
            }
            width={isMastervariantExisted ? 320 : image.dimensions.w / 1.8}
            height={isMastervariantExisted ? 420 : image.dimensions.h / 2}
            alt={image.label || t('noExistAltMessage')}
            layout={'fixed'}
            objectFit='contain'
          />
        ))}
      </div>
      {isMastervariantExisted && (
        <div className={attributesStyle}>
          <Atributes atributes={variant.attributes!} />
        </div>
      )}
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
