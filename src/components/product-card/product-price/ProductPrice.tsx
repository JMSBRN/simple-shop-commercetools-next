import React, { useEffect, useState } from 'react';
import { Price } from '@commercetools/platform-sdk';
import { formatValue } from '../utilsProductCard';
import { getPricesUrlsFromProduct } from '@/commercetools/utils/utilsShoppingList';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductPrice.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function ProductPrice({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const { country } = useAppSelector(selectCommerceTools);
  const { productPriceContainer } = styles;

  const [prices, setPrices] = useState<Price[]>();

  useEffect(() => {
    const fetchFn = async () => {
      const res = await getPricesUrlsFromProduct(productId);

      if (res) setPrices(res);
    };

    fetchFn();
  }, [productId]);

  const filteredPrices = prices?.filter((el) => el.country === country);

  return (
    <div className={productPriceContainer}>
      {filteredPrices?.length ? (
        prices
          ?.filter((el) => el.country === country)
          .map((el) => (
            <div key={el.id}>
              <div className="">{`${quantity || 1} * ${formatValue(el.value)}`}
              <span>{el.value.currencyCode}</span>
              </div>
            </div>
          ))
      ) : (
        <div className="">no price</div>
      )}
    </div>
  );
}

export default ProductPrice;
