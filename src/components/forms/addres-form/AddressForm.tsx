import React, { useState } from 'react';
import { BaseAddress } from '@commercetools/platform-sdk';
import InputField from '../input-field/InputField';
import TextArea from '../textarea/Textarea';
import styles from './AddressForm.module.scss';

function AddressForm({
  formRef,
  addressFields,
  onSubmit,
  inputWithCalcWidth,
}: {
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
  addressFields: (keyof BaseAddress)[][];
  onSubmit: (updatedAddress: BaseAddress) => void;
  inputWithCalcWidth?: boolean;
}) {
  const {
    formContainer,
    inputRow,
    inputContainer,
    inputContainerWithCalcWidth,
  } = styles;
  const [formData, setFormData] = useState<BaseAddress>({} as BaseAddress);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderInputField = (
    fieldName: keyof BaseAddress,
    fieldType?: string
  ) => {
    return (
      <InputField
        fieldName={fieldName}
        fieldType={fieldType}
        formData={formData}
        handleChange={handleChange}
      />
    );
  };

  const renderTextAreaField = (
    fieldName: keyof BaseAddress,
    isNotRequired?: boolean
  ) => (
    <TextArea
      fieldName={fieldName}
      formData={formData}
      handleChange={handleChange}
      isNotRequired={isNotRequired}
    />
  );

  return (
    <div className={formContainer}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {addressFields.map((pair, idx) => (
          <div className={inputRow} key={idx}>
            {pair.map((el, idx) => (
              <div
                className={
                  inputWithCalcWidth
                    ? inputContainerWithCalcWidth
                    : inputContainer
                }
                key={idx}
              >
                {el === 'additionalStreetInfo'
                  ? renderTextAreaField(el, true)
                  : el === 'email'
                  ? renderInputField(el, 'email')
                  : renderInputField(el)}
              </div>
            ))}
          </div>
        ))}
      </form>
    </div>
  );
}

export default AddressForm;
