import Image from 'next/image';
import { Product } from '@commercetools/platform-sdk';
import React from 'react';
import styles from './ProductCard.module.scss';

function ProductCard({ product }: { product: Product }) {
  const { staged } = product.masterData;
  const { name, masterVariant } = staged;
  const productName = Object.values(name)[0];
  const { images } = masterVariant;

  return (
    <div className={styles.productCardContainer}>
      <div>{productName}</div>
      {images?.map((el, idx) => (
        <Image
          key={idx}
          src={el.url}
          width={50}
          height={70}
          alt={el.label || 'alt not exist sorry for that'}
        />
      ))}
    </div>
  );
}

export default ProductCard;
