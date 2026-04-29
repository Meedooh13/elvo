import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const variants = {
  primary: 'bg-accent text-white font-semibold hover:bg-[var(--accent-hover)] hover:shadow-[0_0_24px_var(--accent-glow)] active:scale-[0.98]',
  secondary: 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] hover:border-accent hover:text-accent',
  ghost: 'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]',
  danger: 'bg-transparent border border-red-300 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20',
};

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-full',
  md: 'px-5 py-2.5 text-sm rounded-full',
  lg: 'px-8 py-3.5 text-sm rounded-full',
};

export const Button: React.FC<Props> = ({
  variant = 'primary', size = 'md', loading, children, className = '', disabled, ...rest
}) => (
  <button
    className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200
      ${variants[variant]} ${sizes[size]}
      ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && (
      <svg className="animate-spin h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    )}
    {children}
  </button>
);
