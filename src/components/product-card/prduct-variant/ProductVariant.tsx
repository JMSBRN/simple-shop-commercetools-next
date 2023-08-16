import Image from 'next/image';
import { ProductVariant } from '@commercetools/platform-sdk';
import React from 'react';
import { formatValue } from '../utilsProductCard';

function ProductVariant({ variant }: { variant: ProductVariant }) {
  return (
    <div>
      {variant.images?.map((image, idx) => (
        <Image
          priority
          key={idx.toString()}
          src={image.url}
          width={50}
          height={70}
          alt={image.label || 'alt not exist sorry for that'}
        />
      ))}
      {variant.attributes?.map((atr, idx) => (
        <div key={idx}>
          <div className="name">{atr.name}</div>
          <div className="label">{atr.value.label}</div>
        </div>
      ))}
      {variant.prices?.map((price) => (
        <div key={price.id}>
          <div className="">{formatValue(price.value)}</div>
          <div className="">{price.value.currencyCode}</div>
        </div>
      ))}
    </div>
  );
}

export default ProductVariant;
