import React, { useCallback, useMemo } from 'react';
import { useUserRole } from '../../contexts/UserRoleContext';
import { UserRole } from '../../types/UserRole';
import { ChevronDown, Shield, User, Star, Calendar, DollarSign, UserX } from 'lucide-react';
import { clsx } from 'clsx';

interface RoleSwitcherProps {
  className?: string;
  variant?: 'admin' | 'dashboard' | 'dev';
  showLabel?: boolean;
  onRoleChange?: (role: UserRole) => void;
}

/**
 * Unified RoleSwitcher component for all contexts
 * Consolidates admin, dashboard, and dev role switchers
 */
export const RoleSwitcher: React.FC<RoleSwitcherProps> = React.memo(({
  className = '',
  variant = 'dashboard',
  showLabel = true,
  onRoleChange,
}) => {
  const { currentRole, setCurrentRole, availableRoles } = useUserRole();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Role configuration with icons and colors
  const roleConfig = useMemo(() => ({
    admin: {
      label: 'Admin',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Full system access',
    },
    annual: {
      label: 'Annual',
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Annual subscription',
    },
    monthly: {
      label: 'Monthly',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Monthly subscription',
    },
    downsell: {
      label: 'Downsell',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      description: 'Affiliate access only',
    },
    trial: {
      label: 'Trial',
      icon: User,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      description: '7-day trial period',
    },
    free: {
      label: 'Free',
      icon: UserX,
      color: 'text-gray-500',
      bgColor: 'bg-gray-50',
      description: 'Limited access',
    },
  }), []);

  const currentRoleConfig = roleConfig[currentRole] || roleConfig.free;
  const Icon = currentRoleConfig.icon;

  // Handle role change
  const handleRoleChange = useCallback((role: UserRole) => {
    setCurrentRole(role);
    setIsOpen(false);
    onRoleChange?.(role);
    
    // Log role change for audit
    console.log(`[RoleSwitcher] Role changed to: ${role}`);
  }, [setCurrentRole, onRoleChange]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter roles based on variant
  const displayRoles = useMemo(() => {
    if (variant === 'admin') {
      return availableRoles;
    }
    if (variant === 'dev') {
      return Object.keys(roleConfig) as UserRole[];
    }
    // Dashboard variant - exclude admin unless current role is admin
    return availableRoles.filter(role => role !== 'admin' || currentRole === 'admin');
  }, [variant, availableRoles, currentRole, roleConfig]);

  const containerClasses = clsx(
    'relative inline-block text-left',
    className
  );

  const buttonClasses = clsx(
    'inline-flex items-center justify-between w-full px-4 py-2',
    'text-sm font-medium rounded-lg border',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500': variant === 'dashboard',
      'bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700 focus:ring-purple-500': variant === 'admin',
      'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 focus:ring-blue-500': variant === 'dev',
    }
  );

  const dropdownClasses = clsx(
    'absolute right-0 z-50 mt-2 w-56 rounded-lg shadow-lg',
    'ring-1 ring-black ring-opacity-5',
    'transform transition-all duration-200 origin-top-right',
    {
      'bg-white': variant === 'dashboard' || variant === 'dev',
      'bg-gray-800': variant === 'admin',
      'scale-95 opacity-0 pointer-events-none': !isOpen,
      'scale-100 opacity-100': isOpen,
    }
  );

  return (
    <div className={containerClasses} ref={dropdownRef}>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="flex items-center">
          <span className={clsx('p-1 rounded-md mr-2', currentRoleConfig.bgColor)}>
            <Icon className={clsx('h-4 w-4', currentRoleConfig.color)} />
          </span>
          {showLabel && (
            <span className="flex flex-col items-start">
              <span className="font-medium">{currentRoleConfig.label}</span>
              {variant === 'admin' && (
                <span className="text-xs opacity-75">{currentRoleConfig.description}</span>
              )}
            </span>
          )}
        </span>
        <ChevronDown
          className={clsx('ml-2 h-4 w-4 transition-transform duration-200', {
            'transform rotate-180': isOpen,
          })}
        />
      </button>

      <div className={dropdownClasses}>
        <div className="py-1" role="menu" aria-orientation="vertical">
          {displayRoles.map((role) => {
            const config = roleConfig[role];
            if (!config) return null;
            
            const RoleIcon = config.icon;
            const isActive = role === currentRole;
            
            const itemClasses = clsx(
              'flex items-center px-4 py-2 text-sm cursor-pointer',
              'transition-colors duration-150',
              {
                'bg-gray-100 text-gray-900': isActive && variant !== 'admin',
                'bg-gray-700 text-white': isActive && variant === 'admin',
                'text-gray-700 hover:bg-gray-50': !isActive && variant !== 'admin',
                'text-gray-300 hover:bg-gray-700': !isActive && variant === 'admin',
              }
            );
            
            return (
              <div
                key={role}
                className={itemClasses}
                role="menuitem"
                onClick={() => handleRoleChange(role)}
              >
                <span className={clsx('p-1 rounded-md mr-3', config.bgColor)}>
                  <RoleIcon className={clsx('h-4 w-4', config.color)} />
                </span>
                <div className="flex-1">
                  <div className="font-medium">{config.label}</div>
                  <div className={clsx('text-xs', {
                    'text-gray-500': variant !== 'admin',
                    'text-gray-400': variant === 'admin',
                  })}>
                    {config.description}
                  </div>
                </div>
                {isActive && (
                  <svg className="h-4 w-4 text-green-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

RoleSwitcher.displayName = 'RoleSwitcher';

export default RoleSwitcher;