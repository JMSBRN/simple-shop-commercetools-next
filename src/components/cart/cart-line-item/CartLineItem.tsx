import Image from 'next/image';
import React from 'react';
import styles from './CartLineItem.module.scss';

function CartLineItem() {
    const { 
        lineItem,
        deleteLineItem,
        description,
        descriptionInfoContainer,
        price,
        saleBage,
        quantity,
        total
       } = styles;

  return   <div className={lineItem}>
  <div className={deleteLineItem}>delete</div>
  <div className={description}>
    <Image src={''} width={30} height={45} alt='product image' />
    <div className={descriptionInfoContainer}>
      <div>Product name</div>
      <div>Product size</div>
      <div>sku</div>
    </div>
  </div>
  <div className={price}>
  $150.00
  <div className={saleBage}>Sale</div>
  </div>
  <div className={quantity}>
    <button type="button">+</button>
    <div>0</div>
    <button type="button">-</button>
  </div>
  <div className={total}>$ 120.00</div>
</div>;
}

export default CartLineItem;
