import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { BaseAddress } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import styles from './InputField.module.scss';

function InputField({
  fieldName,
  fieldType,
  isRequired,
  formData,
  handleChange,
  defaultValue,
}: {
  fieldName: keyof AuthCustomerDraftFields | keyof BaseAddress | keyof CustomerInfo | string;
  formData: any;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number | readonly string[];
}) {
  const [inputValue, setInputValue] = useState(formData[fieldName] || defaultValue || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    handleChange(e);
  };

  return (
    <div key={fieldName} className={styles.inputContainer}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {isRequired !== false && <span>*</span>}
        <input
          type={fieldType || 'text'}
          name={fieldName}
          value={inputValue}
          onChange={handleInputChange}
          required={isRequired === undefined ? true : isRequired}
        />
      </label>
    </div>
  );
}

export default InputField;
