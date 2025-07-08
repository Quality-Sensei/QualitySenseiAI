
import React from 'react';

interface InputGroupProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, id, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-sky-300 mb-2">
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-slate-100 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6 placeholder:text-slate-400 transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputGroup;
