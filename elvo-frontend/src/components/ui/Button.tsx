import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary: 'bg-accent hover:bg-[var(--accent-hover)] text-white font-semibold',
  secondary: 'bg-surface border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--surface-2)]',
  ghost: 'bg-transparent text-[var(--text-primary)] hover:bg-surface',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export const Button: React.FC<Props> = ({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...rest
}) => (
  <button
    className={`rounded-md transition-colors duration-200 inline-flex items-center justify-center gap-2
      ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {children}
  </button>
);
