import Image from 'next/legacy/image';
import { LineItem } from '@commercetools/platform-sdk';
import ProductDescription from '@/components/product/product-description/ProductDescription';
import ProductPrice from '@/components/product/product-price/ProductPrice';
import QuantityDisplay from '@/components/product/quantity-display/QuantityDisplay';
import TotalAmount from '@/components/product/total-amount/TotalAmount';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CartLineItem.module.scss';
import { useAppSelector } from '@/hooks/storeHooks';
import { useTranslation } from 'next-i18next';
import useUpdateProductQuantity from '@/hooks/commercetools-hooks/useUpdateProductQuantity';

function CartLineItem({
  cartId,
  lineItem,
  isDeleteBtnNotExisted,
  isQuantityButtonsExisted,
  isTotlaSummExisted,
}: {
  cartId: string;
  lineItem: LineItem;
  isDeleteBtnNotExisted?: boolean;
  isQuantityButtonsExisted?: boolean;
  isTotlaSummExisted?: boolean;
}) {
  const { lineItemStyle, deleteLineItem, currentQuantityStyle } = styles;
  const { language } = useAppSelector(selectCommerceTools);
  const { variant, name, quantity, price } = lineItem;
  const { images } = variant;
  const { t } = useTranslation('common');
  const {
    handleMinusQuantity,
    handlePlusQuantity,
    handleDeleteLineItem,
    currentQuantity,
  } = useUpdateProductQuantity(cartId, lineItem);

  return (
    <div className={lineItemStyle}>
      {!isDeleteBtnNotExisted && (
        <div className={deleteLineItem} onClick={() => handleDeleteLineItem()}>
          {t('delete')}
        </div>
      )}
      <Image
        priority
        objectFit="fill"
        src={
          images?.find((el) => el.url)?.url! || {
            src: '/images/No-Image-Placeholder.svg',
            width: 10,
            height: 10,
          }
        }
        width={40}
        height={50}
        alt="product image"
      />
      <ProductDescription language={language} name={name} />
      <ProductPrice price={price} />
      <div className={currentQuantityStyle}></div>
      <QuantityDisplay
        isQuantityButtonsExisted={isQuantityButtonsExisted}
        quantity={quantity}
        currentQuantity={currentQuantity}
        handleDecrement={handlePlusQuantity}
        handleIncrement={handleMinusQuantity}
        isFlexModeExisted={true}
      />
      {isTotlaSummExisted! && <TotalAmount taxedPrice={lineItem.taxedPrice!} />}
    </div>
  );
}

export default CartLineItem;
