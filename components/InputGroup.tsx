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
      <label htmlFor={id} style={{ color: 'var(--accent-teal)', fontWeight: 500, marginBottom: 8, display: 'block', fontSize: '1rem' }}>
        {label}
      </label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        style={{
          width: '100%',
          borderRadius: '0.5rem',
          border: 'none',
          background: 'rgba(255,255,255,0.05)',
          padding: '0.75rem 1rem',
          color: 'var(--text-main)',
          boxShadow: 'var(--ui-shadow)',
          outline: 'none',
          fontSize: '1rem',
          transition: 'box-shadow 0.2s',
        }}
        className="focus-ring"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputGroup;
