import React, { useState, useRef } from 'react';
import SendIcon from '../shared/icons/SendIcon';
import UploadIcon from '../shared/icons/UploadIcon';
import XCircleIcon from '../shared/icons/XCircleIcon';
import { UploadedImage } from '../../types/chatbot';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  uploadedImage: UploadedImage | null;
  setUploadedImage: (image: UploadedImage | null) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled = false, uploadedImage, setUploadedImage }) => {
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || uploadedImage) {
      onSendMessage(text);
      setText('');
      // The hook will handle clearing the image
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setUploadedImage({
          base64: base64String,
          mimeType: file.type,
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      background: 'rgba(255,255,255,0.85)',
      borderRadius: '1.5rem',
      boxShadow: '0 2px 8px 0 var(--accent-teal)',
      padding: '1rem 1.5rem',
      marginTop: 16,
      marginBottom: 16,
      backdropFilter: 'blur(8px) saturate(180%)',
      WebkitBackdropFilter: 'blur(8px) saturate(180%)',
    }} className="legendary-glass">
      <input
        type="text"
        style={{
          flex: 1,
          border: 'none',
          borderRadius: '1rem',
          background: 'rgba(255,255,255,0.7)',
          padding: '1rem 1.25rem',
          fontSize: '1.1rem',
          color: 'var(--text-main)',
          outline: 'none',
          boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
        }}
        placeholder={disabled ? "API key required..." : "Type your message..."}
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isLoading || disabled}
        className="focus-ring"
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: 'var(--accent-lavender)',
          border: 'none',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          color: 'var(--primary-base)',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 0 8px 0 var(--accent-lavender)',
          cursor: 'pointer',
        }}
        title="Upload image"
        disabled={isLoading || disabled}
      >
        <UploadIcon className="w-5 h-5" />
      </button>
      <button
        type="submit"
        style={{
          background: 'var(--accent-teal)',
          border: 'none',
          borderRadius: '0.75rem',
          padding: '0.75rem',
          color: 'var(--primary-base)',
          fontWeight: 700,
          fontSize: '1.1rem',
          boxShadow: '0 0 8px 0 var(--accent-teal)',
          cursor: 'pointer',
        }}
        title="Send"
        disabled={isLoading || disabled}
      >
        <SendIcon className="w-5 h-5" />
      </button>
      {uploadedImage && (
        <button
          type="button"
          onClick={() => setUploadedImage(null)}
          style={{
            background: '#FFB703',
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            color: 'var(--primary-base)',
            fontWeight: 700,
            fontSize: '1.1rem',
            boxShadow: '0 0 8px 0 #FFB703',
            cursor: 'pointer',
          }}
          title="Remove image"
        >
          <XCircleIcon className="w-5 h-5" />
        </button>
      )}
    </form>
  );
};

export default ChatInput;