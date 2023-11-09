import React, { useState } from 'react';
import { Product } from '@commercetools/platform-sdk';
import ProductCardVariant from './prduct-variant/ProductCardVariant';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import { setDynamicArray } from '../../commercetools/utils/utilsProductCard';
import styles from './ProductCard.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useTranslation } from 'next-i18next';

function ProductCard({ product }: { product: Product }) {
  const {
    productCardContainer,
    variantsContainer,
    variantStyle,
    activVariantStyle,
    productNameStyle
  } = styles;
  const { language } = useAppSelector(selectCommerceTools);
  const { staged, current } = product.masterData;
  const { name } = staged;
  const productName = filterObjectAndReturnValue(name, language);
  const { masterVariant, variants } = current;
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const { t } = useTranslation('common');
  const handleOptionChange = (option: number) => {
    setSelectedOption(option === selectedOption ? 0 : option);
  };

  function setActiveCalss(condition: boolean) {
    if (condition) {
      return activVariantStyle;
    }
    return variantStyle;
  }

  return (
    <div className={productCardContainer}>
      <div className={variantsContainer}>
        {selectedOption ? (
          <div className={variantStyle} onClick={() => setSelectedOption(0)}>
            {t('origin')}
          </div>
        ) : null}
        {setDynamicArray(variants.length).map((option, idx) => (
          <div
            className={setActiveCalss(selectedOption === option)}
            key={idx.toString()}
            onClick={() => handleOptionChange(option)}
          >
            {t('variant')}
          </div>
        ))}
      </div>
      <div className={productNameStyle}>{productName}</div>
      {!selectedOption ? (
        <ProductCardVariant variant={masterVariant} />
      ) : (
        <>
          {variants
            .filter((el) => el.id === selectedOption + 1)
            .map((el) => (
              <ProductCardVariant key={el.id} variant={el} />
            ))}
        </>
      )}
    </div>
  );
}

export default ProductCard;
