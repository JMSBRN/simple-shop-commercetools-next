import Image from 'next/image';
import { LineItem } from '@commercetools/platform-sdk';
import ProductDescription from '@/components/product/product-description/ProductDescription';
import ProductPrice from '@/components/product/product-price/ProductPrice';
import QuantityDisplay from '@/components/product/quantity-display/QuantityDisplay';
import TotalAmount from '@/components/product/total-amount/TotalAmount';
import { selectCommerceTools } from '@/features/commerceTools/CommerceToolsSlice';
import styles from './CartLineItem.module.scss';
import trashImage  from '../../../../public/icons/trash.png';
import { useAppSelector } from '@/hooks/storeHooks';
import useUpdateProductQuantity from '@/hooks/commercetools-hooks/useUpdateProductQuantity';

function CartLineItem({
  cartId,
  lineItem,
  isDeleteBtnNotExisted,
  isQuantityButtonsExisted,
  isTotlaSummExisted,
  isImageNotExisted,
}: {
  cartId: string;
  lineItem: LineItem;
  isDeleteBtnNotExisted?: boolean;
  isQuantityButtonsExisted?: boolean;
  isTotlaSummExisted?: boolean;
  isImageNotExisted?: boolean;
}) {
  const { lineItemStyle, deleteLineItem } = styles;
  const { language } = useAppSelector(selectCommerceTools);
  const { variant, name, quantity, price } = lineItem;
  const { images } = variant;
  const {
    handleMinusQuantity,
    handlePlusQuantity,
    handleDeleteLineItem,
    currentQuantity,
  } = useUpdateProductQuantity({ cartId, lineItem });

  return (
    <div className={lineItemStyle}>
      {!isDeleteBtnNotExisted && (
        <div className={deleteLineItem} onClick={() => handleDeleteLineItem()}>
          <Image
           priority
           alt="trash icon for delete btn"
           src={trashImage}
           />
        </div>
      )}
      {!isImageNotExisted && (
        <Image
          priority
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

      )}
      <ProductDescription language={language} name={name} />
      <ProductPrice price={price} />
      <QuantityDisplay
        isQuantityButtonsExisted={isQuantityButtonsExisted}
        quantity={quantity}
        currentQuantity={currentQuantity}
        handleIncrement={handlePlusQuantity}
        handleDecrement={handleMinusQuantity}
        isFlexModeExisted={true}
      />
      {isTotlaSummExisted! && <TotalAmount taxedPrice={lineItem.taxedPrice!} />}
    </div>
  );
}

export default CartLineItem;
