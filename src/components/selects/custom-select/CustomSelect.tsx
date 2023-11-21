import React, { useState } from 'react';
import styles from './CustomCelect.module.scss';

function CustomSelect({
  options,
  selectedOption,
  onSelectOptionValue,
  withSubstringMethod,
}: {
  options: string[];
  selectedOption: string;
  onSelectOptionValue: (e: React.MouseEvent<HTMLOptionElement>) => void;
  withSubstringMethod?: boolean;
}) {
  const { selectedOptionStyle, optionsStyle, optionStyle } = styles;
  const [isOptionsListRendered, setIsOptionsListRendered] =
    useState<boolean>(false);

  return (
    <div
      className={selectedOptionStyle}
      onClick={() => setIsOptionsListRendered(!isOptionsListRendered)}
    >
      <div
        style={{ visibility: `${!isOptionsListRendered ? 'visible' :  'hidden' }` }}
      >
        {selectedOption}
      </div>
      {isOptionsListRendered && (
        <div className={optionsStyle}>
          {options.map((el) => (
            <option
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
