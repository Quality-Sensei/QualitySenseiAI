import React, { useState, useRef } from 'react';
import { Message, Role } from '../../types/chatbot';
import BotIcon from './icons/BotIcon';
import UserIcon from './icons/UserIcon';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from '../icons/CheckIcon';

interface ChatMessageProps {
  message: Message;
}

const PreComponent = ({ node, children, ...props }: any) => {
    const preRef = useRef<HTMLPreElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Extract language from the code block's class name e.g., "language-js" -> "js"
    const lang = node?.children?.[0]?.properties?.className?.[0]?.replace('language-', '') || 'bash';

    const handleCopy = () => {
        const codeText = preRef.current?.innerText;
        if (codeText) {
            navigator.clipboard.writeText(codeText).then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            });
        }
    };

    return (
        <div className="bg-[#282c34] rounded-xl my-4 overflow-hidden shadow-lg border border-gray-700/50">
            {/* Terminal Header */}
            <div className="bg-gray-800/70 flex items-center p-2 px-4 text-xs border-b border-gray-700/50">
                <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="flex-1 text-center text-gray-400 font-mono select-none uppercase text-[11px]">{lang}</div>
                <div className="w-24 flex justify-end">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                        aria-label="Copy code to clipboard"
                        disabled={isCopied}
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-xs">Copied</span>
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-4 h-4" />
                                <span className="text-xs">Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Content */}
            <pre 
                ref={preRef} 
                {...props} 
                // Reset prose styles on pre and its code child
                className="!bg-transparent !my-0 !p-0 font-mono text-sm overflow-x-auto 
                           [&>code]:!bg-transparent [&>code]:p-4 [&>code]:text-gray-200
                           [&>code]:font-mono"
            >
                {children}
            </pre>
        </div>
    );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.role === Role.BOT;

  const wrapperClasses = isBot ? 'justify-start' : 'justify-end';
  const bubbleClasses = isBot
    ? 'bg-background-light text-text-primary rounded-tr-2xl rounded-bl-2xl rounded-br-2xl'
    : 'bg-brand-primary text-text-light rounded-tl-2xl rounded-bl-2xl rounded-br-2xl';
  const iconClasses = 'w-8 h-8 rounded-full flex items-center justify-center';

  const proseStyles = `
    prose-sm max-w-none 
    prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 
    prose-table:my-4 prose-thead:border-b-2 prose-thead:border-gray-300 prose-tr:border-b prose-tr:border-gray-200 
    prose-th:text-text-primary prose-td:text-text-secondary
    prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:font-semibold prose-code:text-sm prose-code:text-text-primary prose-code:before:content-[""] prose-code:after:content-[""]
    prose-a:text-brand-primary hover:prose-a:underline
    prose-strong:font-semibold
    prose-headings:font-bold prose-headings:my-4
  `;

  return (
    <div className={`flex items-start gap-3 ${wrapperClasses} animate-slide-in-bottom`}>
      {isBot && (
        <div className={`${iconClasses} bg-gray-200 self-start`}>
          <BotIcon className="w-5 h-5 text-gray-600" />
        </div>
      )}
      <div
        className={`max-w-2xl p-4 shadow-md ${bubbleClasses} ${message.isError ? 'bg-red-100 text-red-800 border border-red-300' : ''}`}
      >
        {isBot ? (
            <div className={`prose ${proseStyles}`}>
                {message.text ? (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{ pre: PreComponent }}
                    >
                        {message.text}
                    </ReactMarkdown>
                ) : (
                    <div className="flex space-x-1.5 justify-center items-center h-5">
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                    </div>
                )}
            </div>
        ) : (
            <div className="whitespace-pre-wrap">{message.text}</div>
        )}
      </div>
      {!isBot && (
        <div className={`${iconClasses} bg-gray-700 self-start`}>
          <UserIcon className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;