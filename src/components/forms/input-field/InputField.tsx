import React, { HTMLInputTypeAttribute } from 'react';
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
  fieldName: keyof AuthCustomerDraftFields | keyof BaseAddress | keyof CustomerInfo | string ;
  formData: any;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isRequired?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string | number | readonly string[];
}) {
  return (
    <div key={fieldName} className={styles.inputContainer}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {(isRequired === undefined) && <span>*</span>}
        <input
          type={fieldType || 'text'}
          name={fieldName}
          value={formData[fieldName] || defaultValue || ''}
          onChange={handleChange}
          required={isRequired === undefined ? true : isRequired}

        />
      </label>
    </div>
  );
}

export default InputField;
