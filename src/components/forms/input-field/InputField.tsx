import { AutocompleteValue, CustomerInfo } from '@/interfaces';
import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { BaseAddress } from '@commercetools/platform-sdk';
import { FormType } from '../../../../@types/resources';
import styles from './InputField.module.scss';
import { useTranslation } from 'next-i18next';

function InputField({
  fieldName,
  fieldType,
  isRequired,
  formData,
  handleChange,
  defaultValue,
  errorMessage,
  isPasswordConfirmMode,
  autoCompleteType
}: {
  fieldName:
    | keyof AuthCustomerDraftFields
    | keyof BaseAddress
    | keyof CustomerInfo
    | keyof FormType
    | string;
  formData: any;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number | readonly string[];
  errorMessage?: string;
  isPasswordConfirmMode?: boolean;
  autoCompleteType?: AutocompleteValue;
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
  const { t } = useTranslation('form');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleChange(e);
  };

  return (
    <div key={fieldName} className={inputContainer}>
      <label>
        {t(fieldName as keyof FormType)}
        {isRequired !== false && <span>*</span>}
        <input
          type={!isVisibleMode ? fieldType || 'text' : 'text'}
          name={fieldName}
          value={inputValue}
          onChange={handleInputChange}
          required={isRequired === undefined ? true : isRequired}
          autoComplete={autoCompleteType || 'off'}
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
            {isVisibleMode ? `${t('hide')}` : `${t('visible')}`}
          </div>
        )}
        <div className={errorMessageStyle}>{errorMessage || ''}</div>
      </label>
    </div>
  );
}

export default InputField;
