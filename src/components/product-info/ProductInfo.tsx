import { Product, ProductVariant } from '@commercetools/platform-sdk';
import ButtonWithCounter from '../buttons/button-with-counter/ButtonWithCounter';
import ProductCardVariant from '../product-card/prduct-variant/ProductCardVariant';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductInfo.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import useCreateCart from '@/hooks/commercetools-hooks/useCreateCart';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';

function ProductInfo({ product }: { product: Product }) {
  const [selectedIdVariant, setSelectedIdVariant] = useState<number>(1);
  const {
    productInfoContainer,
    masterVarianStyle,
    variantsStyle,
    variantStyle,
    addToCardContainerStyle,
  } = styles;
  const { current, staged } = product.masterData;
  const { masterVariant, variants } = current;
  const { name } = staged;
  const { language } = useAppSelector(selectCommerceTools);
  const productName = filterObjectAndReturnValue(name, language);
  const [currentVariants, setCurrentVariants] =
    useState<ProductVariant[]>(variants);
  const [quantity, setQuantity] = useState<number>(0);
  const { t } = useTranslation('common');
  const {
    handleCreateCard
  } = useCreateCart({
    productId: product.id,
    quantity,
    selectedIdVariant
  });

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
      <div className={masterVarianStyle}>
        {selectedIdVariant === 1 ? (
          <ProductCardVariant
            productName={productName!}
            variant={masterVariant}
            isMastervariantExisted={true}
          />
        ) : (
          <>
            {variants
              .filter((el) => el.id === selectedIdVariant)
              .map((el) => (
                <ProductCardVariant
                  key={el.id}
                  variant={el}
                  productName={productName!}
                  isMastervariantExisted={true}
                />
              ))}
          </>
        )}
      </div>
      <div className={addToCardContainerStyle}>
        <ButtonWithCounter
          text={t('addToCart')}
          quantity={quantity}
          setQuantity={setQuantity}
          onClick={handleCreateCard}
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
