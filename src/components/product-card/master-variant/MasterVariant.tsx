import Atributes from '../atributes/Atributes';
import Image from 'next/image';
import Link from 'next/link';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../../../commercetools/utils/utilsProductCard';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './MasterVariant.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

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
    ImageStyle,
    imageLayoutStyle,
  } = styles;
  const { images, attributes, prices } = masterVariant;

  const { country } = useAppSelector(selectCommerceTools);
   
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
        <Atributes atributes={attributes!} />
      </div>
      <div className="description">{}</div>
      <div className={pricesStyle}>
        {prices
          ?.filter((el) => el.country === country)
          .map((price) => (
            <div key={price.id}>
              <div className={ priceCurrencyStyle }>{`${formatValue(
                price.value
              )} ${price.value.currencyCode}`}</div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default MasterVariant;
