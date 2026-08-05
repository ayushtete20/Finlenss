import React from 'react';

export const ClayButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none';

  const variants = {
    primary: 'bg-[#0D47A1] hover:bg-[#2196F3] text-white font-bold shadow-md transition-colors active:scale-95',
    secondary: 'bg-[#90CAF9]/30 text-[#0D47A1] hover:bg-[#90CAF9]/60 font-semibold',
    outline: 'border border-[#90CAF9] text-[#0D47A1] hover:bg-[#90CAF9]/20 hover:border-[#2196F3]',
    danger: 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg hover:from-rose-500 hover:to-red-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default ClayButton;
