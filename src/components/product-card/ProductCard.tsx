import { Product } from '@commercetools/platform-sdk';
import ProductCardVariant from './prduct-variant/ProductCardVariant';
import React from 'react';
import SliderWithElements from '../sliders/slider-with-elements/SliderWithElements';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductCard.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';

function ProductCard({ product }: { product: Product }) {
  const { productCardContainer, sliderContainer, productNameStyle } = styles;
  const { language } = useAppSelector(selectCommerceTools);
  const { current } = product.masterData;
  const { masterVariant, variants } = current;
  const { staged } = product.masterData;
  const { name } = staged;
  const productName = filterObjectAndReturnValue(name, language);
  const combinedVariants = [masterVariant, ...variants];

  return (
    <div className={productCardContainer}>
      <div className={productNameStyle}>{productName}</div>
      <div className={sliderContainer}>
        <SliderWithElements isButtonsExisted={!!variants.length}>
          {combinedVariants.map((el, idx) => (
            <div key={idx}>
              <ProductCardVariant variant={el} />
            </div>
          ))}
        </SliderWithElements>
      </div>
    </div>
  );
}

export default ProductCard;
