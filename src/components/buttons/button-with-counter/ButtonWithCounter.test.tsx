import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonWithCounter from './ButtonWithCounter';

describe('ButtonWithCounter', () => {
    test('renders properly', () => {
        const { getByText } = render(
            <ButtonWithCounter
                isLoading={false}
                quantity={0}
                setQuantity={() => { }}
                text="Test Button"
                onClick={() => { }}
            />
        );

        expect(getByText('Test Button')).toBeInTheDocument();
        expect(getByText('0')).toBeInTheDocument();
    });

    test('handles quantity increment correctly', () => {
        const setQuantityMock = jest.fn();
        const { getByText } = render(
            <ButtonWithCounter
                isLoading={false}
                quantity={2}
                setQuantity={setQuantityMock}
                text="Test Button"
                onClick={() => { }}
            />
        );

        fireEvent.click(getByText('+'));

        expect(setQuantityMock).toHaveBeenCalledWith(3);
    });

    test('handles quantity decrement correctly', () => {
        const setQuantityMock = jest.fn();
        const { getByText } = render(
            <ButtonWithCounter
                isLoading={false}
                quantity={2}
                setQuantity={setQuantityMock}
                text="Test Button"
                onClick={() => { }}
            />
        );

        fireEvent.click(getByText('-'));

        expect(setQuantityMock).toHaveBeenCalledWith(1);
    });

    test('handles quantity not going below 0', () => {
        const setQuantityMock = jest.fn();
        const { getByText } = render(
            <ButtonWithCounter
                isLoading={false}
                quantity={0}
                setQuantity={setQuantityMock}
                text="Test Button"
                onClick={() => { }}
            />
        );

        fireEvent.click(getByText('-'));

        expect(setQuantityMock).not.toHaveBeenCalled();
    });
});
