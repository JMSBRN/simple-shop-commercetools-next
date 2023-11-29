import Counter from '@/components/buttons/counter/Counter';
import React from 'react';
import styles from './QuantityDisplay.module.scss';

function QuantityDisplay({
  isQuantityButtonsExisted,
  isFlexModeExisted,
  quantity,
  currentQuantity,
  handleIncrement,
  handleDecrement,
}: {
    isQuantityButtonsExisted?: boolean;
    isFlexModeExisted?: boolean;
    quantity: number;
    currentQuantity: number;
    handleIncrement: () => void;
    handleDecrement: () => void;
  } 

) {
  const { counterWrapperStyle, quantityStyle } = styles;

  return (
    <div
      className={isQuantityButtonsExisted ? counterWrapperStyle : quantityStyle}
    >
      {isQuantityButtonsExisted ? (
        <Counter
          flexMode={isFlexModeExisted}
          quantity={currentQuantity}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
        />
      ) : (
        <div className={quantityStyle}>
          <span>{'*'}</span>
          <span>{quantity}</span>
        </div>
      )}
    </div>
  );
}

export default QuantityDisplay;
