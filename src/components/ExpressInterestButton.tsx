'use client';

import React, { useState } from 'react';

interface ExpressInterestButtonProps {
  id: string;
  hasExpressedInterest: boolean;
  onExpressInterest: (id: string) => Promise<void>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled: boolean;
  variant?: 'primary' | 'secondary';
}

export default function ExpressInterestButton({
  id,
  hasExpressedInterest,
  onExpressInterest,
  className = '',
  size = 'md',
  variant = 'primary',
  disabled = false,
}: ExpressInterestButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClick = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await onExpressInterest(id);
    } catch (error) {
      console.error('Failed to express interest:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: hasExpressedInterest
      ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 focus:ring-green-500'
      : 'bg-efcaAccent text-white hover:bg-blue-700 focus:ring-efcaAccent',
    secondary: hasExpressedInterest
      ? 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100 focus:ring-green-500'
      : 'bg-white text-efcaAccent border border-efcaAccent hover:bg-efcaAccent hover:text-white focus:ring-efcaAccent',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing || disabled}
      className={`
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        rounded font-semibold transition-colors focus:outline-none focus:ring-2
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}}
        ${className}
      `}
    >
      {isProcessing ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Processing...
        </div>
      ) : hasExpressedInterest ? (
        <div className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Interest Expressed
        </div>
      ) : (
        'Express Interest'
      )}
    </button>
  );
}
