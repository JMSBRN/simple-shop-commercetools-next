import { Cart, Product, ProductVariant } from '@commercetools/platform-sdk';
import {
  addLineItemToCart,
  createCartWithProductId,
  getCurrentDataFromCart,
} from '@/commercetools/utils/utilsCarts';
import {
  getDecryptedDataFromCookie,
  setEncryptedDataToCookie,
} from '@/commercetools/utils/secureCookiesUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import ButtonWithCounter from '../buttons/button-with-counter/ButtonWithCounter';
import ProductCardVariant from '../product-card/prduct-variant/ProductCardVariant';
import { UserData } from '@/interfaces';
import { fetchCarts } from '@/features/thunks/FetchCarts';
import { filterObjectAndReturnValue } from '@/commercetools/utils/utilsCommercTools';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './ProductInfo.module.scss';
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
  const { language, status } = useAppSelector(selectCommerceTools);
  const productName = filterObjectAndReturnValue(name, language);
  const [currentVariants, setCurrentVariants] =
    useState<ProductVariant[]>(variants);
  const dispatch = useAppDispatch();
  const { country } = useAppSelector(selectCommerceTools);
  const [quantity, setQuantity] = useState<number>(0);
  const anonimouseId = process.env.ANONIMOUS_ID;
  const { t } = useTranslation('common');
  const productId = product.id;

  const userData = JSON.parse(getDecryptedDataFromCookie('userData')) as
    | UserData
    | undefined;

  const handleSelectVariant = (id: number) => {
    setSelectedIdVariant(id);
    if (id !== 1) {
      setCurrentVariants([...variants, masterVariant]);
    } else {
      setCurrentVariants(variants);
    }
  };

  const handleCreateCard = async () => {
    const currentCartId = JSON.parse(
      getDecryptedDataFromCookie('currentCartId')
    ) as string | undefined;

    if (quantity && !currentCartId) {
      const resNewCart = await createCartWithProductId(
        country,
        productId,
        selectedIdVariant,
        quantity,
        userData?.customerId ? undefined : anonimouseId,
        userData?.customerId
      );
      const newCart = resNewCart?.body as Cart;

      if (newCart?.id) {
        setEncryptedDataToCookie('currentCartId', newCart.id, 3600);
        dispatch(fetchCarts());
      }
    }

    if (quantity && currentCartId) {
      const cart = await getCurrentDataFromCart(currentCartId);
      const { version } = cart!;

      await addLineItemToCart(
        currentCartId,
        version,
        productId,
        quantity,
        selectedIdVariant
      );
      dispatch(fetchCarts());
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
          isLoading={status === 'loading'}
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
