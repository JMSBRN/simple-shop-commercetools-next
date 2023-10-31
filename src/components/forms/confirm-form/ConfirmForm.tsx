import React, { useRef } from 'react';
import ButtonWithLoader from '@/commercetools/buttons/buttonWithLoader/ButtonWithLoader';
import InputField from '../input-field/InputField';
import styles from './ConfirmForm.module.scss';

function ConfirmForm({
  formRef,
  onSubmit,
  formData,
  handleChange,
  errorMessage,
  isLoading,
}: {
  formRef?: React.LegacyRef<HTMLFormElement>;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  isLoading?: boolean;
}) {
  const { formContainer, errorMessageStyle } = styles;
  const inputSubRef = useRef<HTMLInputElement>(null);

  return (
    <div className={formContainer}>
      <form ref={formRef} onSubmit={onSubmit}>
        {Array.from(['password', 'confirm_password'], (el, idx) => (
          <div key={idx}>
            <InputField
              fieldName={el || 'test'}
              fieldType="password"
              isPasswordConfirmMode={true}
              isRequired={true}
              formData={formData}
              handleChange={handleChange}
              autoCompleteType="current-password"
            />
          </div>
        ))}
        <ButtonWithLoader
          onClick={() => inputSubRef.current?.onclick}
          text="confirm to delete"
          isLoading={isLoading}
        />
        <input ref={inputSubRef} type="submit" style={{ display: 'none' }} />
      </form>
      <div className={errorMessageStyle}>{errorMessage}</div>
    </div>
  );
}

export default ConfirmForm;
