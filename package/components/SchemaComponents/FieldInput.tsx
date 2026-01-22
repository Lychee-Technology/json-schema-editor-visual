import { useState, useCallback, useEffect, KeyboardEvent, ChangeEvent, FocusEvent } from 'react';
import { Input } from '../ui';

export interface FieldInputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  addonAfter?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
}

export function FieldInput({
  value: propValue,
  onChange,
  addonAfter,
  disabled,
  placeholder,
}: FieldInputProps) {
  const [value, setValue] = useState(propValue);

  useEffect(() => {
    if (propValue !== value) {
      setValue(propValue);
    }
  }, [propValue]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleKeyUp = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const target = e.target as HTMLInputElement;
        if (target.value !== propValue) {
          onChange(e as unknown as ChangeEvent<HTMLInputElement>);
        }
      }
    },
    [propValue, onChange]
  );

  const handleBlur = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (e.target.value !== propValue) {
        onChange(e as unknown as ChangeEvent<HTMLInputElement>);
      }
    },
    [propValue, onChange]
  );

  return (
    <Input
      value={value}
      onChange={handleChange}
      onKeyUp={handleKeyUp}
      onBlur={handleBlur}
      addonAfter={addonAfter}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
}

export default FieldInput;
