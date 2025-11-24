'use client';

import React, { useState } from 'react';
import { Button } from '../../../lib';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'tsx',
  title,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      {title && (
        <div className="bg-gray-800 px-4 py-2 flex justify-between items-center">
          <span className="text-gray-300 text-sm font-medium">{title}</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            className="text-xs"
          >
            {copied ? '✓ Copiado' : '📋 Copiar'}
          </Button>
        </div>
      )}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  );
};
