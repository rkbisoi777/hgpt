import React from 'react';
import { countryCodes } from '../../constants/countryCodes';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function PhoneInput({ value, onChange, disabled, required }: PhoneInputProps) {
  const [countryCode, localNumber] = value.startsWith('+') 
    ? [value.split(' ')[0], value.split(' ')[1] || '']
    : ['+91', value]; // Default to India (+91)

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(`${e.target.value} ${localNumber}`);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${countryCode} ${e.target.value}`);
  };

  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={handleCountryChange}
        disabled={disabled}
        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
      >
        {countryCodes.map(({ code, name }) => (
          <option key={code} value={code}>
            {code} {name}
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={localNumber}
        onChange={handleNumberChange}
        placeholder="Phone number"
        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        disabled={disabled}
        required={required}
      />
    </div>
  );
}