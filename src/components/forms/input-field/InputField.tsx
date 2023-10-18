import React, { HTMLInputTypeAttribute } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { BaseAddress } from '@commercetools/platform-sdk';

function InputField({
  fieldName,
  fieldType,
  isNotRequired,
  formData,
  handleChange,
}: {
  fieldName: keyof AuthCustomerDraftFields | keyof BaseAddress ;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldType?: HTMLInputTypeAttribute | undefined;
  isNotRequired?: boolean;
}) {
  return (
    <div key={fieldName}>
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
