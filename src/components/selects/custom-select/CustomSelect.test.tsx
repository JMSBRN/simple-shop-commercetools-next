import { render, fireEvent } from "@testing-library/react";
import CustomSelect, { CustomSelectProps } from "./CustomSelect";

const renderCustomSelect = (customProperties: Partial<CustomSelectProps> = {}) => {
  const defaultProperties: CustomSelectProps = {
    options: ['Option 1', 'Option 2', 'Option 3'],
    selectedOption: 'Option 1',
    onSelectOptionValue: jest.fn(), // Mocking the onSelectOptionValue function
    withSubstringMethod: true,
  };
  const mergedProps = { ...defaultProperties, ...customProperties };

  const { getByTestId, getAllByTestId } = render(<CustomSelect {...mergedProps} />);

  return {
    getByTestId,
    getAllByTestId,
    onSelectOptionValue: mergedProps.onSelectOptionValue,
  };
};

describe('CustomSelect component', () => {
  test('renders CustomSelect component', () => {
    const { getByTestId } = renderCustomSelect();
    expect(getByTestId('custom-select')).toBeInTheDocument();
  });

  test('displays selected option', () => {
    const selectedOption = 'Option 1';
    const { getByTestId } = renderCustomSelect({ selectedOption });
    expect(getByTestId('selected-option')).toHaveTextContent(selectedOption);
  });

  test('clicking on selected option toggles options list visibility', () => {
    const { getByTestId } = renderCustomSelect();
    const selectedOptionContainer = getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    expect(selectedOptionContainer).toHaveStyle('visibility: hidden');

    fireEvent.click(selectedOptionContainer);
    expect(selectedOptionContainer).toHaveStyle('visibility: visible');
  });

  test('renders options list when selected option is clicked', () => {
    const { getByTestId, getAllByTestId } = renderCustomSelect();
    const selectedOptionContainer = getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    expect(getAllByTestId('option')).toHaveLength(3);
  });

  test('calls onSelectOptionValue when an option is clicked', () => {
    const { getByTestId, getAllByTestId, onSelectOptionValue } = renderCustomSelect();
    const selectedOptionContainer = getByTestId('selected-option');

    fireEvent.click(selectedOptionContainer);
    const optionElement = getAllByTestId('option')[0];
    fireEvent.click(optionElement);

    expect(onSelectOptionValue).toHaveBeenCalledTimes(1);
    expect(onSelectOptionValue).toHaveBeenCalledWith(expect.anything());
  });
});
