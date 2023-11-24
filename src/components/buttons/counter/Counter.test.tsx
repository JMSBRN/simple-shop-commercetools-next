import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Counter from './Counter';
import '@testing-library/jest-dom';

test('Counter component renders with the correct quantity and buttons', () => {
    const quantity = 5;
    const handleIncrement = jest.fn();
    const handleDecrement = jest.fn();

    const { getByText } = render(
        <Counter quantity={quantity} handleIncrement={handleIncrement} handleDecrement={handleDecrement} />
    );

    expect(getByText(quantity.toString())).toBeInTheDocument();

    // Check if the increment button is present and functional
    const incrementButton = getByText('+');
    expect(incrementButton).toBeInTheDocument();
    fireEvent.click(incrementButton);
    expect(handleIncrement).toHaveBeenCalledTimes(1);

    // Check if the decrement button is present and functional
    const decrementButton = getByText('-');
    expect(decrementButton).toBeInTheDocument();
    fireEvent.click(decrementButton);
    expect(handleDecrement).toHaveBeenCalledTimes(1);
});
