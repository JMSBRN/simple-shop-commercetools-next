import React, { useState } from 'react';
import styles from './CustomCelect.module.scss';

export interface CustomSelectProps {
  options: string[];
  selectedOption: string;
  onSelectOptionValue: (e: React.MouseEvent<HTMLOptionElement>) => void;
  withSubstringMethod?: boolean;
}
function CustomSelect({
  options,
  selectedOption,
  onSelectOptionValue,
  withSubstringMethod,
}: CustomSelectProps) {
  const { selectedOptionStyle, optionsStyle, optionStyle } = styles;
  const [isOptionsListRendered, setIsOptionsListRendered] =
    useState<boolean>(false);

  return (
    <div
      data-testid="custom-select"
      className={selectedOptionStyle}
      onClick={() => setIsOptionsListRendered(!isOptionsListRendered)}
    >
      <div
        data-testid="selected-option"
        style={{
          visibility: `${!isOptionsListRendered ? 'visible' : 'hidden'}`,
        }}
      >
        {selectedOption}
      </div>
      {isOptionsListRendered && (
        <div className={optionsStyle}>
          {options.map((el) => (
            <option
              data-testid="option"
              className={optionStyle}
              key={el}
              value={el}
              onClick={onSelectOptionValue}
            >
              {withSubstringMethod ? el.substring(3) : el}
            </option>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
