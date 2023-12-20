import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ButtonWithCounter from './ButtonWithCounter';
import React from 'react';

describe('ButtonWithCounter', () => {
    const renderButtonWithLoader = (props = {}) => {
        const defaultProps = {
            isLoading: false,
            quantity: 0,
            setQuantity: () => { },
            text: 'Test Button',
            onClick: () => { }
        };

        render(<ButtonWithCounter {...defaultProps} {...props} />);

        const btnPlus = screen.getByTestId('btn-plus');
        const btnMinus = screen.getByTestId('btn-minus');

        return {
            text: defaultProps.text,
            btnPlus,
            btnMinus,
        };
    };

    test('renders properly', () => {
        const { text } = renderButtonWithLoader();

        expect(screen.getByText(text)).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('handles quantity increment correctly', () => {
        const setQuantityMock = jest.fn();
        const { btnPlus } = renderButtonWithLoader({ quantity: 2, setQuantity: setQuantityMock });

        fireEvent.click(btnPlus);
        expect(setQuantityMock).toHaveBeenCalledWith(3);
    });

    test('handles quantity decrement correctly', () => {
        const setQuantityMock = jest.fn();
        const { btnMinus } = renderButtonWithLoader({ quantity: 2, setQuantity: setQuantityMock });

        fireEvent.click(btnMinus);
        expect(setQuantityMock).toHaveBeenCalledWith(1);
    });

    test('handles quantity not going below 0', () => {
        const setQuantityMock = jest.fn();
        const { btnMinus } = renderButtonWithLoader({ quantity: 0 });

        fireEvent.click(btnMinus);
        expect(setQuantityMock).not.toHaveBeenCalled();
    });
});
