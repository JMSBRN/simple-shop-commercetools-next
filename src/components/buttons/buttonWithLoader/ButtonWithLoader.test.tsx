import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import ButtonWithLoader from './ButtonWithLoader';
import React from 'react';

describe('ButtonWithLoader component', () => {
  const onClick = jest.fn();

  const renderButtonWithLoader = (props = {}) => {
    const defaultProps = {
      text: 'Click me',
      onClick,
      isLoading: false,
    };

    render(<ButtonWithLoader {...defaultProps} {...props} />);

    return {
      text: defaultProps.text,
      button: screen.getByRole('button')
    };

  };

  describe('Rendering', () => {
    test('renders button text correctly', () => {
      const { button, text } = renderButtonWithLoader();

      expect(screen.getByText(text)).toBeInTheDocument();
      expect(button).toBeInTheDocument();
    });
  });

  describe('Click event', () => {
    test('calls onClick handler when clicked', () => {
      const { button } = renderButtonWithLoader();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Loading state', () => {
    test('renders with loading style when isLoading is true', () => {
      const { button } = renderButtonWithLoader({ isLoading: true });

      expect(button).toHaveClass('buttonStyleWithLoader');
    });

    test('renders without loading style when isLoading is false', () => {
      const { button } = renderButtonWithLoader();

      expect(button).toHaveClass('buttonStyle');
    });
  });
});

