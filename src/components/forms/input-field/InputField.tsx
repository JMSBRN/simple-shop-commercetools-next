import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { BaseAddress } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import { removeUnderscores } from '@/commercetools/utils/utilsApp';
import styles from './InputField.module.scss';

function InputField({
  fieldName,
  fieldType,
  isRequired,
  formData,
  handleChange,
  defaultValue,
  errorMessage,
  isPasswordConfirmMode,
}: {
  fieldName:
    | keyof AuthCustomerDraftFields
    | keyof BaseAddress
    | keyof CustomerInfo
    | string;
  formData: any;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number | readonly string[];
  errorMessage?: string;
  isPasswordConfirmMode?: boolean;
}) {
  const {
    inputContainer,
    errorMessageStyle,
    visibleModeButtonStyle,
    visibleModeButtonStyleActive,
  } = styles;
  const [inputValue, setInputValue] = useState(
    formData[fieldName] || defaultValue || ''
  );
  const [isVisibleMode, setIsVisibleMode] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleChange(e);
  };

  return (
    <div key={fieldName} className={inputContainer}>
      <label>
        {removeUnderscores(
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        )}
        {isRequired !== false && <span>*</span>}
        <input
          type={!isVisibleMode ? fieldType || 'text' : 'text'}
          name={fieldName}
          value={inputValue}
          onChange={handleInputChange}
          required={isRequired === undefined ? true : isRequired}
        />
        {isPasswordConfirmMode && (
          <div
            className={
              isVisibleMode
                ? visibleModeButtonStyleActive
                : visibleModeButtonStyle
            }
            onClick={() => setIsVisibleMode(!isVisibleMode)}
          >
            visible
          </div>
        )}
        <div className={errorMessageStyle}>{errorMessage || ''}</div>
      </label>
    </div>
  );
}

export default InputField;
