import CustomSelect, { CustomSelectProps } from './CustomSelect';
import { fireEvent, render, screen } from '@testing-library/react';

const renderCustomSelect = (customProperties: Partial<CustomSelectProps> = {}) => {
  const defaultProperties: CustomSelectProps = {
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOption: 'Option 1',
    onSelectOptionValue: jest.fn(), // Mocking the onSelectOptionValue function
    withSubstringMethod: true,
  };
  const mergedProps = { ...defaultProperties, ...customProperties };

  render(<CustomSelect {...mergedProps} />);

  return {
    onSelectOptionValue: mergedProps.onSelectOptionValue,
  };
};

describe('CustomSelect component', () => {
  test('renders CustomSelect component', () => {
  renderCustomSelect();

    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
  });

  test('displays selected option', () => {
    const selectedOption = 'Option 1';

    renderCustomSelect({ selectedOption });

    expect(screen.getByTestId('selected-option')).toHaveTextContent(selectedOption);
  });

  test('clicking on selected option toggles options list visibility', () => {
    renderCustomSelect();
    const selectedOptionContainer = screen.getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    expect(selectedOptionContainer).toHaveStyle('visibility: hidden');

    fireEvent.click(selectedOptionContainer);
    expect(selectedOptionContainer).toHaveStyle('visibility: visible');
  });

  test('renders options list when selected option is clicked', () => {
    renderCustomSelect();
    const selectedOptionContainer = screen.getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    expect(screen.getAllByTestId('option')).toHaveLength(3);
  });

  test('calls onSelectOptionValue when an option is clicked', () => {
    const { onSelectOptionValue } = renderCustomSelect();
    const selectedOptionContainer = screen.getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    const optionElement = screen.getAllByTestId('option')[0];

    fireEvent.click(optionElement);

    expect(onSelectOptionValue).toHaveBeenCalledTimes(1);
    expect(onSelectOptionValue).toHaveBeenCalledWith(expect.anything());
  });
});
