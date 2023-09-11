import React, { useEffect, useState } from 'react';
import { selectCommerceTools, setCurrency } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { Price } from '@commercetools/platform-sdk';
import { getCurrencySymbol } from '@/commercetools/utils/utilsCommercTools';
import { getPricesFromProduct } from '@/commercetools/utils/utilsShoppingList';
import { setTotalPriceWithComma } from '@/components/product-card/utilsProductCard';
import styles from './LineItemPrice.module.scss';

function LineItemTotalPrice({
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
        const currency = res
          .filter((el) => el.country === country)
          .find((el) => el.value.currencyCode)?.value.currencyCode;
          
          if(currency) dispatch(setCurrency(currency));
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
                {setTotalPriceWithComma(quantity, el.value)}
                <span>{getCurrencySymbol(country, el.value.currencyCode)}</span>
              </div>
            </div>
          ))
      ) : (
        <div className={noPriceMessage}>
          <div>{quantity || ''} </div> no price
        </div>
      )}
    </div>
  );
}

export default LineItemTotalPrice;
