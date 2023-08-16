import React, { useState } from 'react';
import { Product } from '@commercetools/platform-sdk';
import ProductVariant from './prduct-variant/ProductVariant';
import { setDynamicArray } from './utilsProductCard';
import styles from './ProductCard.module.scss';

function ProductCard({ product }: { product: Product }) {
  const { staged, current } = product.masterData;
  const { name } = staged;
  const productName = Object.values(name)[0];
  const { masterVariant, variants } = current;
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const handleOptionChange = (option: number) => {
    setSelectedOption(option === selectedOption ? 0 : option);
  };

  return (
    <div className={styles.productCardContainer}>
      {selectedOption ? (
        <div className="" onClick={() => setSelectedOption(0)}>
          master variant
        </div>
      ) : null }
      {setDynamicArray(variants.length).map((option, idx) => (
        <label key={idx.toString()}>
          <input
            type="radio"
            checked={selectedOption === option}
            onChange={() => handleOptionChange(option)}
          />
          variant {option}
        </label>
      ))}
      <div>{productName}</div>
      {!selectedOption ? ( <ProductVariant variant={masterVariant} />) : (
       <>
        {
          variants.filter((el) => el.id === selectedOption + 1).map((el) => (
            <ProductVariant key={el.id}  variant={el}/>
          ))
        }
       </>
       
      )}
    </div>
  );
}

export default ProductCard;
