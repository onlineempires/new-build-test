import React from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  style?: React.CSSProperties;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  style = {}
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Variant styles using CSS variables for theme compatibility
  const getVariantStyles = (variant: BadgeVariant): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--color-primary)',
          color: 'var(--text-on-primary)',
          borderColor: 'var(--color-primary)'
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--color-secondary)',
          color: 'var(--text-on-secondary)',
          borderColor: 'var(--color-secondary)'
        };
      case 'success':
        return {
          backgroundColor: 'var(--color-success)',
          color: 'var(--text-on-success)',
          borderColor: 'var(--color-success)'
        };
      case 'warning':
        return {
          backgroundColor: 'var(--color-warning)',
          color: 'var(--text-on-warning)',
          borderColor: 'var(--color-warning)'
        };
      case 'error':
        return {
          backgroundColor: 'var(--color-error)',
          color: 'var(--text-on-error)',
          borderColor: 'var(--color-error)'
        };
      case 'info':
        return {
          backgroundColor: 'var(--color-info)',
          color: 'var(--text-on-info)',
          borderColor: 'var(--color-info)'
        };
      default:
        return {
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          borderColor: 'var(--color-border)'
        };
    }
  };

  const combinedStyles = {
    ...getVariantStyles(variant),
    ...style
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-all duration-200 ${sizeClasses[size]} ${className}`}
      style={combinedStyles}
    >
      {children}
    </span>
  );
};

// Specialized badge components for common use cases
export const LevelBadge: React.FC<{ level: string; className?: string }> = ({ level, className = '' }) => {
  const getLevelVariant = (level: string): BadgeVariant => {
    if (level.includes('6A Leader')) return 'primary';
    if (level.includes('6A2 Leader')) return 'secondary';
    if (level.includes('6A4-3 Leader')) return 'success';
    if (level.includes('6A2-3 Leader')) return 'warning';
    if (level.includes('6A8-4 Leader')) return 'error';
    return 'default';
  };

  return (
    <Badge variant={getLevelVariant(level)} size="sm" className={className}>
      {level}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ 
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'error'; 
  className?: string;
}> = ({ status, className = '' }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'error': return 'error';
      case 'inactive': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'active': return '●';
      case 'completed': return '✓';
      case 'pending': return '○';
      case 'error': return '✕';
      case 'inactive': return '○';
      default: return '';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} size="sm" className={className}>
      <span className="mr-1">{getStatusIcon(status)}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export const SpecialtyBadge: React.FC<{ 
  specialty: string; 
  className?: string;
}> = ({ specialty, className = '' }) => {
  // Specialty-specific variants for better visual hierarchy
  const getSpecialtyVariant = (specialty: string): BadgeVariant => {
    const lower = specialty.toLowerCase();
    if (lower.includes('marketing') || lower.includes('ads')) return 'primary';
    if (lower.includes('sales') || lower.includes('conversion')) return 'success';
    if (lower.includes('content') || lower.includes('social')) return 'info';
    if (lower.includes('strategy') || lower.includes('business')) return 'warning';
    if (lower.includes('tech') || lower.includes('automation')) return 'secondary';
    return 'default';
  };

  return (
    <Badge variant={getSpecialtyVariant(specialty)} size="xs" className={className}>
      {specialty}
    </Badge>
  );
};

export default Badge;