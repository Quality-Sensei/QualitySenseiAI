import React from 'react';

interface TextAreaFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  required?: boolean;
  rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ label, id, value, onChange, placeholder, required = false, rows = 4 }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <label htmlFor={id} style={{ color: 'var(--accent-teal)', fontWeight: 700, marginBottom: 8, display: 'block', fontSize: '1.1rem', letterSpacing: '-0.01em' }}>
        {label} {required && <span style={{ color: '#FF6B6B' }}>*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.7)',
          border: '1.5px solid var(--secondary-blue)',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
          padding: '1rem 1.25rem',
          color: 'var(--text-main)',
          fontSize: '1.1rem',
          outline: 'none',
          transition: 'border 0.2s, box-shadow 0.2s',
        }}
        className="focus-ring"
      />
    </div>
  );
};

export default TextAreaField;
