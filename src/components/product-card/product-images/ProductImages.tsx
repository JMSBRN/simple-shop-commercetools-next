import React, { useEffect, useState } from 'react';
import Image from "next/legacy/image";
import { getImagesUrlsFromProduct } from '@/commercetools/utils/utilsShoppingList';
import styles from './ProductImages.module.scss';

function ProductImages({
  productId,
  width,
  height,
  alt,
}: {
  productId: string;
  width?: number;
  height?: number;
  alt?: string;
}) {
  const {
    imagesContainer
  } = styles;   
  const [urls, setUrls] = useState<string[]>();

  useEffect(() => {
    const fetchFn = async () => {
      const res = await getImagesUrlsFromProduct(productId);

      if (res) setUrls(res);
    };

    fetchFn();
  }, [productId]);
  return (
    <div className={imagesContainer}>
      {urls?.map((el) => (
        <Image
          key={el}
          src={el}
          width={width || 20}
          height={height || 20}
          alt={alt || 'product image'}
        />
      ))}
    </div>
  );
}

export default ProductImages;
