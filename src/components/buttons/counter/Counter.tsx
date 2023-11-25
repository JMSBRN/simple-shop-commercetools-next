import React from 'react';
import styles from './Counter.module.scss';
import Image from 'next/legacy/image';
import plusImage from '../../../../public/svgs/plus.svg';
import minusImage from '../../../../public/svgs/minus.svg';

function Counter({ quantity, handleIncrement, handleDecrement, flexMode }: {
  flexMode?: boolean;
  quantity: number;
  handleIncrement: () => void;
  handleDecrement: () => void;
}) {
  const { counter, counterFlexMode } = styles;

  return <div data-testid="counter" className={flexMode ? counterFlexMode : counter}>
    <button data-testid="btn-plus" onClick={handleIncrement}>
      <Image
        src={plusImage}
        layout='fixed'
        width={20}
        height={20}
        alt='plus image'
      />
    </button>
    <div>
      {quantity}
    </div>
    <button data-testid="btn-minus" onClick={handleDecrement}>
      <Image
        src={minusImage}
        layout='fixed'
        width={30}
        height={30}
        alt='minus image'
      />
    </button>
  </div>;
}

export default Counter;
