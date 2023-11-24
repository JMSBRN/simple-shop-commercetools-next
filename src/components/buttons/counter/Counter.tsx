import React from 'react';
import styles from './Counter.module.scss';

function Counter({ quantity, handleIncrement, handleDecrement }: {
  quantity: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}) {
  return <div className={styles.counter}>
    <button onClick={handleIncrement}>+</button>
    {quantity}
    <button onClick={handleDecrement}>-</button>
  </div>;
}

export default Counter;
