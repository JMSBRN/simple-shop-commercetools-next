import React, { useState } from 'react';
import { BaseAddress } from '@commercetools/platform-sdk';
import styles from './AddressForm.module.scss';

function AddressForm({
  formRef,
  addressFields,
  onSubmit,
}: {
  formRef: React.LegacyRef<HTMLFormElement> | undefined;
  addressFields: (keyof BaseAddress)[][];
  onSubmit: (updatedAddress: BaseAddress) => void;
}) {
  const { formContainer, inputRow, inputContainer } = styles;
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const renderInputField = (
    fieldName: keyof BaseAddress,
    fieldType?: string,
    required: boolean = true
  ) => (
    <div key={fieldName}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {required && <span >*</span>}
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
  const renderTextAreaField = (
    fieldName: keyof BaseAddress,
    required: boolean = true
  ) => (
    <div key={fieldName}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {required && <span >*</span>}
        <textarea
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          required={required}
        />
      </label>
    </div>
  );

  return (
    <div className={formContainer}>
      <form ref={formRef} onSubmit={handleSubmit}>
        {addressFields.map((pair, idx) => (
          <div className={inputRow} key={idx}>
            {pair.map((el, idx) => (
              <div className={inputContainer} key={idx}>
                {(el === 'additionalStreetInfo') ? renderTextAreaField(el, false) : (
                 el === 'email' ? renderInputField(el, 'email') : renderInputField(el) 
                )}
              </div>
            ))}
          </div>
        ))}
      </form>
    </div>
  );
}

export default AddressForm;
