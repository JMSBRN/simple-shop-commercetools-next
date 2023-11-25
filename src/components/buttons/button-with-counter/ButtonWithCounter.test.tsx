import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonWithCounter from './ButtonWithCounter';

describe('ButtonWithCounter', () => {
    const renderButtonWithLoader = (props={}) => {
       const defaultProps = {
        isLoading: false,
        quantity: 0,
        setQuantity: () => { },
        text: 'Test Button',
        onClick: () => { }
       }
       const { getByTestId, getByText } = render(<ButtonWithCounter {...defaultProps} {...props}  />);
       const btnPlus = getByTestId('btn-plus');
       const btnMinus = getByTestId('btn-minus');
       return {
         text: defaultProps.text,
         btnPlus,
         btnMinus,
         getByText
       };
    };

    test('renders properly', () => {
        const { text, getByText } = renderButtonWithLoader();
        expect(getByText(text)).toBeInTheDocument();
        expect(getByText('0')).toBeInTheDocument();
    });

    test('handles quantity increment correctly', () => {
        const setQuantityMock = jest.fn();
        const { btnPlus } = renderButtonWithLoader({ quantity: 2,  setQuantity: setQuantityMock });
        fireEvent.click(btnPlus);
        expect(setQuantityMock).toHaveBeenCalledWith(3);
    });

    test('handles quantity decrement correctly', () => {
        const setQuantityMock = jest.fn();
        const { btnMinus } = renderButtonWithLoader({ quantity: 2,  setQuantity: setQuantityMock });
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
