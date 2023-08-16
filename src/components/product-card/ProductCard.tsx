import React, { useState } from 'react';
import { Product } from '@commercetools/platform-sdk';
import ProductVariant from './prduct-variant/ProductVariant';
import { setDynamicArray } from './utilsProductCard';
import styles from './ProductCard.module.scss';

function ProductCard({ product }: { product: Product }) {
  const {
    productCardContainer,
    variantsContainer,
    variantStyle,
    activVariantStyle,
  } = styles;
  const { staged, current } = product.masterData;
  const { name } = staged;
  const productName = Object.values(name)[0];
  const { masterVariant, variants } = current;
  const [selectedOption, setSelectedOption] = useState<number>(0);

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
            origin
          </div>
        ) : null}
        {setDynamicArray(variants.length).map((option, idx) => (
          <div
            className={setActiveCalss(selectedOption === option)}
            key={idx.toString()}
            onClick={() => handleOptionChange(option)}
          >
            variant {option}
          </div>
        ))}
      </div>
      <div>{productName}</div>
      {!selectedOption ? (
        <ProductVariant variant={masterVariant} />
      ) : (
        <>
          {variants
            .filter((el) => el.id === selectedOption + 1)
            .map((el) => (
              <ProductVariant key={el.id} variant={el} />
            ))}
        </>
      )}
    </div>
  );
}

export default ProductCard;
