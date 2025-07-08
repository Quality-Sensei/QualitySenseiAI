import React, { useState, useRef } from 'react';
import SendIcon from './icons/SendIcon';
import UploadIcon from './icons/UploadIcon';
import XCircleIcon from './icons/XCircleIcon';
import { UploadedImage } from '../types';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  uploadedImage: UploadedImage | null;
  setUploadedImage: (image: UploadedImage | null) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, uploadedImage, setUploadedImage }) => {
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
    e.target.value = '';
  };

  return (
    <div>
        {uploadedImage && (
            <div className="mb-3 p-2 border border-border-color rounded-lg relative w-32 h-32">
                <img 
                    src={`data:${uploadedImage.mimeType};base64,${uploadedImage.base64}`} 
                    alt="Upload preview"
                    className="w-full h-full object-cover rounded"
                />
                <button 
                    onClick={() => setUploadedImage(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-md"
                    aria-label="Remove image"
                >
                    <XCircleIcon className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </button>
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="p-3 border border-border-color rounded-full hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="Upload image"
        >
            <UploadIcon className="w-6 h-6 text-gray-600" />
        </button>
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about testing, with or without an image..."
            className="flex-1 p-3 border border-border-color rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary transition-shadow"
            disabled={isLoading}
        />
        <button
            type="submit"
            disabled={isLoading || (!text.trim() && !uploadedImage)}
            className="bg-brand-primary text-white p-3 rounded-full hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            aria-label="Send message"
        >
            {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <SendIcon className="w-6 h-6" />
            )}
        </button>
        </form>
    </div>
  );
};

export default ChatInput;