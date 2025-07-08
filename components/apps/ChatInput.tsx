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
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        className="flex-1 border rounded px-3 py-2"
        placeholder={disabled ? "API key required..." : "Type your message..."}
        value={text}
        onChange={e => setText(e.target.value)}
        disabled={isLoading || disabled}
      />
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2">
        <UploadIcon className="w-5 h-5" />
      </button>
      {uploadedImage && (
        <button type="button" onClick={() => setUploadedImage(null)} className="p-2">
          <XCircleIcon className="w-5 h-5 text-red-500" />
        </button>
      )}
      <button type="submit" className="p-2 bg-blue-500 text-white rounded" disabled={isLoading || disabled || (!text.trim() && !uploadedImage)}>
        <SendIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default ChatInput;