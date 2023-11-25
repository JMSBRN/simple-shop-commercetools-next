import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

describe('Counter component', () => {
  const renderCounter = (props = {}) => {
    const defaultProps = {
      quantity: 0,
      handleIncrement: () => {},
      handleDecrement: () => {},
      flexMode: false,
    };

    const  { getByTestId, getByText } = render(<Counter {...defaultProps} {...props} />);
    const counter = getByTestId('counter');
    const btnPlus = getByTestId('btn-plus');
    const btnMinus = getByTestId('btn-minus');

    return {
      counter,
      btnPlus,
      btnMinus,
      getByText
    }
  };

  test('renders with flex mode styles when flexMode is true', () => {
    const { counter } = renderCounter({ quantity: 5, flexMode: true });
    expect(counter).toHaveClass('counterFlexMode');
  });

  test('renders with default styles when flexMode is false', () => {
    const { counter } = renderCounter({ quantity: 5 });
    expect(counter).toHaveClass('counter');
  });

  test('renders with initial quantity and buttons', () => {
    const { btnPlus, btnMinus, getByText } = renderCounter();
    expect(getByText('0')).toBeInTheDocument();
    expect(btnPlus).toBeInTheDocument();
    expect(btnMinus).toBeInTheDocument();
  });

  test('calls handleIncrement when plus button is clicked', () => {
    const handleIncrementMock = jest.fn();
    const { btnPlus } =  renderCounter({ handleIncrement: handleIncrementMock });
    fireEvent.click(btnPlus);
    expect(handleIncrementMock).toHaveBeenCalledTimes(1);
  });

  test('calls handleDecrement when minus button is clicked', () => {
    const handleDecrementMock = jest.fn();
    const { btnMinus } =  renderCounter({ handleDecrement: handleDecrementMock });
    fireEvent.click(btnMinus);
    expect(handleDecrementMock).toHaveBeenCalledTimes(1);
  });
});


