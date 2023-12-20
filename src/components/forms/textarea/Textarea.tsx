import { BaseAddress } from '@commercetools/platform-sdk';
import styles from './Textarea.module.scss';

function TextArea({
  fieldName,
  isNotRequired,
  formData,
  handleChange,
}: {
  fieldName: keyof BaseAddress;
  formData: any;
  handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void;
      isNotRequired?: boolean;
}) {
  return (
    <div key={fieldName} className={styles.textareaContainer}>
      <label>
        {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
        {!isNotRequired && <span>*</span>}
        <textarea
          name={fieldName}
          value={formData[fieldName] || ''}
          onChange={handleChange}
          required={isNotRequired || true}
        />
      </label>
    </div>
  );
}

export default TextArea;
