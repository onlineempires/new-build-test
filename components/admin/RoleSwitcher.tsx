import { useState } from 'react';
import { useUserRole, UserRole, ROLE_DETAILS } from '../../contexts/UserRoleContext';

export default function RoleSwitcher() {
  const { currentRole, setUserRole } = useUserRole();
  const [isOpen, setIsOpen] = useState(false);

  const roles: UserRole[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-sm transition-colors"
      >
        <i className="fas fa-user-cog text-gray-600"></i>
        <span className="text-gray-700">
          {ROLE_DETAILS[currentRole].name}
        </span>
        <i className={`fas fa-chevron-down text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">
              Switch Role (Testing)
            </div>
            {roles.map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  currentRole === role
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{ROLE_DETAILS[role].name}</div>
                    <div className="text-xs text-gray-500">
                      {ROLE_DETAILS[role].price > 0 ? `$${ROLE_DETAILS[role].price}` : 'Free'} 
                      {ROLE_DETAILS[role].billing !== 'one-time' ? `/${ROLE_DETAILS[role].billing}` : ''}
                    </div>
                  </div>
                  {currentRole === role && (
                    <i className="fas fa-check text-blue-600"></i>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}