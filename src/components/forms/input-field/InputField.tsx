import React, { HTMLInputTypeAttribute } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { BaseAddress } from '@commercetools/platform-sdk';
import { CustomerInfo } from '@/interfaces';
import styles from './InputField.module.scss';

function InputField({
  fieldName,
  fieldType,
  isNotRequired,
  formData,
  handleChange,
}: {
  fieldName: keyof AuthCustomerDraftFields | keyof BaseAddress | keyof CustomerInfo | string ;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isNotRequired?: boolean;
}) {
  return (
    <div key={fieldName} className={styles.inputContainer}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {!isNotRequired && <span>*</span>}
        <input
          type={fieldType || 'text'}
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          required={isNotRequired || true}
        />
      </label>
    </div>
  );
}

export default InputField;
