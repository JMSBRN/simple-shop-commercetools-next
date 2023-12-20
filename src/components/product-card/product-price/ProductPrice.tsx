import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Price } from '@commercetools/platform-sdk';
import { formatValue } from '../../../commercetools/utils/utilsProductCard';
import { getCurrencySymbol } from '@/commercetools/utils/utilsCommercTools';
import { getPricesFromProduct } from '@/commercetools/utils/utilsShoppingList';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductPrice.module.scss';

function ProductPrice({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const { productPriceContainer, noPriceMessage } = styles;

  const [prices, setPrices] = useState<Price[]>();

  useEffect(() => {
    const fetchFn = async () => {
      const res = await getPricesFromProduct(productId);

      if (res) {
        setPrices(res);
      }
    };

    fetchFn();
  }, [country, dispatch, productId]);

  const filteredPrices = prices?.filter((el) => el.country === country);

  return (
    <div className={productPriceContainer}>
      {filteredPrices?.length ? (
        prices
          ?.filter((el) => el.country === country)
          .map((el) => (
            <div key={el.id}>
              <div>
                {`${quantity || 1} * ${formatValue(el.value)}`}
                <span>{getCurrencySymbol(country, el.value.currencyCode)}</span>
              </div>
            </div>
          ))
      ) : (
        <div className={noPriceMessage}>
          <div>{quantity || 1} </div> no price
        </div>
      )}
    </div>
  );
}

export default ProductPrice;
