import React, { HTMLInputTypeAttribute, useState } from 'react';
import { AuthCustomerDraftFields } from '../formsInterfaces';
import { AutocompleteValue } from '@/interfaces';
import InputField from '../input-field/InputField';
import { setErrorMessage } from '@/features/commerceTools/CommerceToolsSlice';
import { useAppDispatch } from '@/hooks/storeHooks';

function AuthForm({
  formFields,
  onSubmit,
  formRef,
  errorMessage,
  isConfirmPasswordExisted,
}: {
  formFields: (keyof AuthCustomerDraftFields)[][];
  onSubmit: (updatedFormData: AuthCustomerDraftFields) => void;
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
  errorMessage: string;
  isConfirmPasswordExisted?: boolean;
}) {
  const dispatch = useAppDispatch();
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

  const setIsPasswordConfirmed = (formData: AuthCustomerDraftFields) => {
    if (formData.password) {
      const { password, passwordConfirm } = formData;

      if (password === passwordConfirm) {
        return true;
      }
      return false;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(setErrorMessage(''));
    e.preventDefault();
    if (isConfirmPasswordExisted) {
      if (setIsPasswordConfirmed(formData)) {
        onSubmit(formData);
        dispatch(setErrorMessage(''));
      } else {
        dispatch(setErrorMessage('The password confirmation does not match'));
      }
    } else {
      onSubmit(formData);
    }
  };

  const renderInputField = (
    fieldName: keyof AuthCustomerDraftFields,
    fieldType?: HTMLInputTypeAttribute | undefined,
    isPasswordConfirmMode?: boolean,
    autoCompleteType?: AutocompleteValue
  ) => {
    return (
      <InputField
        fieldName={fieldName}
        formData={formData}
        fieldType={fieldType}
        handleChange={handleChange}
        isPasswordConfirmMode={isPasswordConfirmMode}
        autoCompleteType={autoCompleteType}
      />
    );
  };

  const renderPasswordInputElement = (el: keyof AuthCustomerDraftFields) => {
    return renderInputField(el, 'password', true, 'current-password');
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
                ? renderPasswordInputElement(el)
                : el === 'passwordConfirm'
                ? renderPasswordInputElement(el)
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

