import { useUserRole, UserRole } from '../../contexts/UserRoleContext';

export default function RoleSwitcher() {
  const { currentRole, setUserRole } = useUserRole();

  const roles: UserRole[] = ['free', 'trial', 'monthly', 'annual', 'downsell', 'admin'];

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border p-4 z-50">
      <div className="text-xs font-semibold text-gray-600 mb-2">🧪 Dev Mode - Role Switcher</div>
      <div className="flex gap-2 flex-wrap">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => setUserRole(role)}
            className={`px-2 py-1 text-xs rounded ${
              currentRole === role 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 mt-2">Current: <strong>{currentRole}</strong></div>
    </div>
  );
}