import { useState, useEffect } from 'react';

const useJsonValidation = (initialValue: string) => {
  const [value, setValue] = useState<string>(initialValue);
  const [isValid, setIsValid] = useState<boolean>(false);

  const validateJson = (json: string) => {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    setIsValid(validateJson(value));
  }, [value]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setIsValid(validateJson(newValue));
  };

  return { value, isValid, handleChange };
};

export default useJsonValidation;

