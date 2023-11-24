import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonWithLoader from './ButtonWithLoader';

describe('ButtonWithLoader component', () => {
  const onClick = jest.fn();
  const buttonText = 'Click me';

  describe('Rendering', () => {
    test('renders button text correctly', () => {
      const { getByText, getByRole } = render(
        <ButtonWithLoader text={buttonText} onClick={onClick} />
      );

      expect(getByText(buttonText)).toBeInTheDocument();

      const button = getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Click event', () => {
    test('calls onClick handler when clicked', () => {
      const { getByRole } = render(
        <ButtonWithLoader text={buttonText} onClick={onClick} />
      );

      const button = getByRole('button');
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading state', () => {
    test('renders with loading style when isLoading is true', () => {
      const { getByRole } = render(
        <ButtonWithLoader text={buttonText} onClick={onClick} isLoading={true} />
      );

      const button = getByRole('button');
      expect(button).toHaveClass('buttonStyleWithLoader');
    });

    test('renders without loading style when isLoading is false', () => {
      const { getByRole } = render(
        <ButtonWithLoader text={buttonText} onClick={onClick} isLoading={false} />
      );

      const button = getByRole('button');
      expect(button).toHaveClass('buttonStyle');
    });
  });
});
