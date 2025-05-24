// hooks/useForm.ts
import { useState } from "react";

interface InputState {
  value: string;
  errorActive: boolean;
  errorMessage: string;
  verify: boolean;
  show?: boolean;
}

interface FormFields {
  [key: string]: InputState;
}

interface UseFormProps {
  initialValues: FormFields;
  validationRules: {
    [key: string]: {
      required?: boolean;
      pattern?: RegExp;
      errorMessage?: string;
      customValidator?: (value: string) => boolean;
    };
  };
}

export const useForm = ({ initialValues, validationRules }: UseFormProps) => {
  const [formFields, setFormFields] = useState<FormFields>(initialValues);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);

  const handleChange = (fieldName: string, value: string) => {
    const rules = validationRules[fieldName];
    let isValid = true;

    if (rules) {
      if (rules.required && !value) {
        isValid = false;
      } else if (rules.pattern && !rules.pattern.test(value)) {
        isValid = false;
      } else if (rules.customValidator && !rules.customValidator(value)) {
        isValid = false;
      }
    }

    setFormFields({
      ...formFields,
      [fieldName]: {
        ...formFields[fieldName],
        value,
        verify: isValid,
        errorMessage: isValid ? "" : rules?.errorMessage || "",
      },
    });
  };

  const handleBlur = (fieldName: string) => {
    setIsFocused(false);
    const field = formFields[fieldName];
    const rules = validationRules[fieldName];

    if (!rules) return;

    let errorActive = false;
    let errorMessage = "";

    if (rules.required && !field.value) {
      errorActive = true;
      errorMessage = `Please enter ${fieldName.toLowerCase()}`;
    } else if (rules.pattern && !rules.pattern.test(field.value)) {
      errorActive = true;
      errorMessage = rules.errorMessage || "Invalid input";
    } else if (rules.customValidator && !rules.customValidator(field.value)) {
      errorActive = true;
      errorMessage = rules.errorMessage || "Invalid input";
    }

    setFormFields({
      ...formFields,
      [fieldName]: {
        ...field,
        errorActive,
        errorMessage,
        verify: !errorActive,
      },
    });
  };

  const resetForm = () => {
    setFormFields(initialValues);
  };

  return {
    formFields,
    isFocused,
    handleFocus,
    handleChange,
    handleBlur,
    resetForm,
    setFormFields,
  };
};