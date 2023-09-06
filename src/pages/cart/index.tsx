import React from 'react';
import styles from '../../styles/Cart.module.scss';

function Cart() {
    const { cartContiner } = styles;

  return (
    <div className={cartContiner}>cart</div>
  );
};

export default Cart;
