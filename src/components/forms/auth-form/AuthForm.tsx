import React, { useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';

function AuthForm({
  formFields,
  onSubmit,
  formRef
}: {
  formFields: (keyof AuthCustomerDraftFields)[][];
  onSubmit: (updatedFormData: AuthCustomerDraftFields) => void;
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
}) {
  const [formData, setFormData] = useState<AuthCustomerDraftFields>(
    {} as AuthCustomerDraftFields
  );
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const renderInputField = (
    fieldName: keyof AuthCustomerDraftFields,
    fieldType?: string,
    required: boolean = true
  ) => (
    <div key={fieldName}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {required && <span>*</span>}
        <input
          type={fieldType || 'text'}
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          required={required}
        />
      </label>
    </div>
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {formFields.map((pair, idx) => (
        <div key={idx}>
          {pair.map((el) => (
            <div className="" key={el}>
              {el === 'email'
                ? renderInputField(el, 'email', true)
                : el === 'password'
                ? renderInputField(el, 'password', true)
                : renderInputField(el, 'text', true)}
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}

export default AuthForm;
