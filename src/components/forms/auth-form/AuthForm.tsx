import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import InputField from '../input-field/InputField';

function AuthForm({
  formFields,
  onSubmit,
  formRef,
  errorMessage,
}: {
  formFields: (keyof AuthCustomerDraftFields)[][];
  onSubmit: (updatedFormData: AuthCustomerDraftFields) => void;
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
  errorMessage: string;
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderInputField = (
    fieldName: keyof AuthCustomerDraftFields,
    fieldType?: HTMLInputTypeAttribute | undefined,
    isPasswordConfirmMode?: boolean
  ) => {
    return (
      <InputField
        fieldName={fieldName}
        formData={formData}
        fieldType={fieldType}
        handleChange={handleChange}
        isPasswordConfirmMode={isPasswordConfirmMode}
      />
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {formFields.map((pair, idx) => (
        <div key={idx}>
          {pair.map((el) => (
            <div key={el}>
              {el === 'email'
                ? renderInputField(el, 'email')
                : el === 'password'
                ? renderInputField(el, 'password', true)
                : el === 'password_Confirm'
                ? renderInputField(el, 'password', true)
                : renderInputField(el)}
            </div>
          ))}
        </div>
      ))}
      <div
        style={{
          width: '100%',
          height: 'auto',
          minHeight: '50px',
          color: 'red',
        }}
      >
        {errorMessage}
      </div>
    </form>
  );
}

export default AuthForm;
