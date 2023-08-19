import React, { useCallback, useEffect, useState } from 'react';
import { Product } from '@commercetools/platform-sdk';
import ProductCard from '@/components/product-card/ProductCard';
import { getProductsByCategoryId } from '@/commercetools/utilsCommercTools';
import styles from '../../styles/Products.module.scss';
import { useRouter } from 'next/router';

function Products() {
  const { push, query } = useRouter();
  const { productsContainer, productsStyle, productInfoStyle } = styles;
  const [products, setProducts] = useState<Product[]>([] as Product[]);
  const { id } = query;
  
  const fetchFn = useCallback(async () => {
    if(typeof id === 'string') {
      const res = await getProductsByCategoryId(id);
 
      if(res) setProducts(res);
    }
  }, [id]);

  useEffect(() => {
  fetchFn();
  },[fetchFn]);

  const handleGetProductInfo = (id: string) => {
    push(`/product-info/${id}`);
  };

  return (
    <div className={productsContainer}>
      <div className={productsStyle}>
        {products
          .map((el) => (
            <div key={el.id}>
              <div
                className={productInfoStyle}
                onClick={() => handleGetProductInfo(el.id)}
              >
                product info
              </div>
              <ProductCard product={el} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default Products;
