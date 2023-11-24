import ButtonWithLoader from '../buttonWithLoader/ButtonWithLoader';
import Counter from '../counter/Counter';
import React from 'react';
import styles from './ButtonWithCounter.module.scss';

function ButtonWithCounter({
  isLoading,
  quantity,
  setQuantity,
  text,
  onClick,
}: {
  isLoading: boolean;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  quantity: number;
  text: string;
  onClick: () => void;
}) {
  const { addToCardContainer, quantityContainer } = styles;
  const handlePlusQuantuty = () => {
    setQuantity(quantity + 1);
};
const handleMinusQuantuty = () => {
    if (quantity) {
        setQuantity(quantity - 1);
    }
};

  return (
    <div className={addToCardContainer}>
      <div className={quantityContainer}>
       <Counter 
        quantity={quantity}
        handleIncrement={handlePlusQuantuty}
        handleDecrement={handleMinusQuantuty}
       />
      </div>
      <ButtonWithLoader
      isLoading={isLoading}
      text={text}
      onClick={onClick}
      />
    </div>
  );
}

export default ButtonWithCounter;
