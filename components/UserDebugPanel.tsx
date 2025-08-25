import { useUserRole } from '../contexts/UserRoleContext';
import { useEffect, useState } from 'react';

export default function UserDebugPanel() {
  const { currentRole, roleDetails, permissions } = useUserRole();
  const [devStorageValues, setDevStorageValues] = useState<any>({});
  
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const updateStorageValues = () => {
        setDevStorageValues({
          userRole: localStorage.getItem('userRole'),
          devRole: localStorage.getItem('dev.role'),
          devTools: localStorage.getItem('devTools'),
          userData: localStorage.getItem('userData')
        });
      };
      
      updateStorageValues();
      
      // Listen for storage changes
      const handleStorageChange = () => updateStorageValues();
      window.addEventListener('storage', handleStorageChange);
      
      // Also listen for custom events
      const handleRoleChange = () => updateStorageValues();
      window.addEventListener('roleChanged', handleRoleChange as any);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('roleChanged', handleRoleChange as any);
      };
    }
  }, []);

  const handleClearCache = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleForceSync = () => {
    // Force sync all storage keys to current role
    localStorage.setItem('userRole', currentRole);
    localStorage.setItem('dev.role', currentRole);
    window.dispatchEvent(new CustomEvent('roleChanged', { detail: { role: currentRole } }));
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2 text-yellow-400">🐛 Auth Debug Panel</h4>
      
      <div className="space-y-1 mb-3">
        <div><strong>Current Role:</strong> {currentRole}</div>
        <div><strong>Display Name:</strong> {roleDetails?.name}</div>
        <div><strong>Badge:</strong> {roleDetails?.badge}</div>
        <div><strong>Can Access Stats:</strong> {permissions?.canAccessStats ? '✅' : '❌'}</div>
      </div>
      
      <div className="border-t border-gray-600 pt-2 mb-3">
        <div className="text-gray-300 mb-1">LocalStorage Values:</div>
        <div>userRole: {devStorageValues.userRole || 'none'}</div>
        <div>dev.role: {devStorageValues.devRole || 'none'}</div>
        <div>devTools: {devStorageValues.devTools || 'none'}</div>
      </div>
      
      <div className="flex flex-col gap-1">
        <button 
          onClick={handleForceSync}
          className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
        >
          🔄 Force Sync All
        </button>
        <button 
          onClick={handleClearCache}
          className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
        >
          🗑️ Clear Cache & Reload
        </button>
      </div>
      
      <div className="text-xs text-gray-400 mt-2">
        This panel helps debug user authentication state mismatches.
      </div>
    </div>
  );
}