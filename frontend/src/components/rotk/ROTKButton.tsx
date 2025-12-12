/**
 * ROTKButton - Period-styled button component
 * 
 * Supports primary (cinnabar), secondary (parchment), and gold variants
 * with proper hover, pressed, and disabled states.
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import '../styles/rotkTheme.css';

export type ROTKButtonVariant = 'primary' | 'secondary' | 'gold';
export type ROTKButtonSize = 'small' | 'medium' | 'large';

interface ROTKButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ROTKButtonVariant;
  size?: ROTKButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

const baseStyles: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  fontFamily: '"Cinzel", Georgia, serif',
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  transition: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
};

const variantStyles: Record<ROTKButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #C41E3A 0%, #8B0000 100%)',
    color: '#FDF6E3',
    border: '2px solid #D4AF37',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #FDF6E3 0%, #D4C5A9 100%)',
    color: '#1A1A1A',
    border: '2px solid #CD7F32',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  gold: {
    background: 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
    color: '#1A1A1A',
    border: '2px solid #B8960F',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
  },
};

const sizeStyles: Record<ROTKButtonSize, React.CSSProperties> = {
  small: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    borderRadius: '2px',
  },
  medium: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    borderRadius: '4px',
  },
  large: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '4px',
  },
};

const hoverStyles: Record<ROTKButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #E85C73 0%, #C41E3A 100%)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15), 0 0 10px rgba(212, 175, 55, 0.4)',
  },
  secondary: {
    background: 'linear-gradient(135deg, #FDF6E3 0%, #BEB19A 100%)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.15), 0 0 10px rgba(212, 175, 55, 0.3)',
    borderColor: '#D4AF37',
  },
  gold: {
    background: 'linear-gradient(135deg, #F5D48A 0%, #D4AF37 100%)',
    boxShadow: '0 6px 12px rgba(0,0,0,0.2), 0 0 15px rgba(212, 175, 55, 0.5)',
  },
};

const disabledStyles: React.CSSProperties = {
  background: '#424242',
  color: '#757575',
  border: '2px solid #424242',
  boxShadow: 'none',
  cursor: 'not-allowed',
  opacity: 0.7,
};

export function ROTKButton({
  variant = 'primary',
  size = 'medium',
  icon: Icon,
  iconPosition = 'left',
  children,
  disabled,
  className = '',
  style = {},
  onMouseEnter,
  onMouseLeave,
  ...props
}: ROTKButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) setIsHovered(true);
    onMouseEnter?.(e);
  };
  
  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(false);
    onMouseLeave?.(e);
  };
  
  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(isHovered && !disabled ? hoverStyles[variant] : {}),
    ...(disabled ? disabledStyles : {}),
    ...style,
  };
  
  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;
  
  return (
    <button
      className={`rotk-button rotk-button-${variant} ${className}`}
      style={combinedStyles}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon size={iconSize} strokeWidth={2} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon size={iconSize} strokeWidth={2} />}
    </button>
  );
}

export default ROTKButton;
