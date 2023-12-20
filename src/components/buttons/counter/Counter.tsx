import Image from 'next/image';
import React from 'react';
import minusImage from '../../../../public/svgs/minus.svg';
import plusImage from '../../../../public/svgs/plus.svg';
import styles from './Counter.module.scss';

function Counter({ quantity, handleIncrement, handleDecrement, flexMode }: {
  flexMode?: boolean;
  quantity: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}) {
  const { counter, counterFlexMode, quantityStyle } = styles;

  return <div data-testid="counter" className={flexMode ? counterFlexMode : counter}>
    <button data-testid="btn-plus" onClick={handleIncrement}>
      <Image
        src={plusImage}
        alt='plus image'
        style={{
          width: '1em',
          height: '1em'
        }}
      />
    </button>
    <div className={quantityStyle}>
      {quantity}
    </div>
    <button data-testid="btn-minus" onClick={handleDecrement}>
      <Image
        src={minusImage}
        alt='minus image'
        style={{
          width: '1.1em',
          height: '1.1em'
        }}
      />
    </button>
  </div>;
}

export default Counter;
