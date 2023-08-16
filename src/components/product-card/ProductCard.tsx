import Image from 'next/image';
import { Product } from '@commercetools/platform-sdk';
import React from 'react';
import formatValue from './utilsProductCard';
import styles from './ProductCard.module.scss';

function ProductCard({ product }: { product: Product }) {
  const { staged, current } = product.masterData;
  const { name } = staged;
  const productName = Object.values(name)[0];

  return (
    <div className={styles.productCardContainer}>
      <div>{productName}</div>
      {current.variants?.map((el) => (
        <div key={el.id}>
          <div className="images">
            {el.images?.map((image, idx) => (
              <Image
                key={idx}
                src={image.url}
                width={50}
                height={70}
                alt={image.label || 'alt not exist sorry for that'}
              />
            ))}
          </div>
          <div className="prices">
            {el.prices?.map((price) => (
              <div key={price.id}>
                <div className="">
                  {formatValue(price.value)}
                </div>
                <div className="">{price.value.currencyCode}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;
