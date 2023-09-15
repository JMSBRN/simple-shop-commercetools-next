import { Product, ProductVariant } from '@commercetools/platform-sdk';
import React, { useState } from 'react';
import AddToCard from '../add-to-card/AddToCard';
import MasterVariant from '../product-card/master-variant/MasterVariant';
import ProductCardVariant from '../product-card/prduct-variant/ProductCardVariant';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductInfo.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function ProductInfo({ product }: { product: Product }) {
  const [selectedIdVariant, setSelectedIdVariant] = useState<number>(1);
  const {
    productInfoContainer,
    variantsStyle,
    variantStyle,
    addToCardContainerStyle,
  } = styles;
  const { current, staged } = product.masterData;
  const { masterVariant, variants } = current;
  const { name } = staged;
  const { prices } = masterVariant;
  const { language, country } = useAppSelector(selectCommerceTools);
  const currency = prices
    ?.filter((el) => el.country === country)
    ?.find((el) => el.value.currencyCode)?.value.currencyCode!;
  const productName = filterObjectAndReturnValue(name, language);
  const [currentVariants, setCurrentVariants] =
    useState<ProductVariant[]>(variants);
  const handleSelectVariant = (id: number) => {
    setSelectedIdVariant(id);
    if (id !== 1) {
      setCurrentVariants([...variants, masterVariant]);
    } else {
      setCurrentVariants(variants);
    }
  };

  return (
    <div className={productInfoContainer}>
      {selectedIdVariant === 1 ? (
        <MasterVariant
          productName={productName!}
          masterVariant={masterVariant}
        />
      ) : (
        <>
          {variants
            .filter((el) => el.id === selectedIdVariant)
            .map((el) => (
              <MasterVariant
                key={el.id}
                masterVariant={el}
                productName={productName!}
              />
            ))}
        </>
      )}
      <div className={addToCardContainerStyle}>
        <AddToCard
          productId={product.id}
          variantId={masterVariant.id}
          currency={currency!}
        />
      </div>
      <div className={variantsStyle}>
        {currentVariants
          .filter((el) => el.id !== selectedIdVariant)
          .map((el) => (
            <div
              className={variantStyle}
              key={el.id}
              onClick={() => handleSelectVariant(el.id)}
            >
              <ProductCardVariant variant={el} />
            </div>
          ))}
      </div>
    </div>
  );
}

export default ProductInfo;
