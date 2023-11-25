import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ButtonWithLoader from './ButtonWithLoader';

describe('ButtonWithLoader component', () => {
  const onClick = jest.fn();

  const renderButtonWithLoader = (props = {}) => {
    const defaultProps = {
      text: 'Click me',
      onClick,
      isLoading: false,
    };
    const { getByText } = render(<ButtonWithLoader {...defaultProps} {...props} />);
    return {
      text: defaultProps.text,
      getByText,
      button: screen.getByRole('button')
    };

  };

  describe('Rendering', () => {
    test('renders button text correctly', () => {
      const { getByText, button, text } = renderButtonWithLoader();
      expect(getByText(text)).toBeInTheDocument();
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

