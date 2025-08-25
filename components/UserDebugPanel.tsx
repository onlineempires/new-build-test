import { useUserRole } from '../contexts/UserRoleContext';
import { useEffect, useState } from 'react';

export default function UserDebugPanel() {
  const { currentRole, roleDetails, permissions } = useUserRole();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
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

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center z-50"
        title="Show Debug Panel"
      >
        🐛
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Minimized State */}
      {!isExpanded && (
        <div className="bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs">🐛</span>
              <span className="text-xs font-medium">Debug</span>
              <div className={`w-2 h-2 rounded-full ${
                currentRole === 'guest' ? 'bg-red-400' : 
                currentRole === 'trial' ? 'bg-yellow-400' : 
                'bg-green-400'
              }`}></div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(true)}
                className="text-gray-400 hover:text-white text-xs"
                title="Expand"
              >
                ⬆️
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-xs"
                title="Hide"
              >
                ❌
              </button>
            </div>
          </div>
          
          {/* Quick Info */}
          <div className="px-3 py-2 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span className={`font-medium ${
                currentRole === 'admin' ? 'text-purple-400' :
                currentRole === 'annual' ? 'text-yellow-400' :
                currentRole === 'monthly' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {currentRole}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stats:</span>
              <span className={permissions?.canAccessStats ? 'text-green-400' : 'text-red-400'}>
                {permissions?.canAccessStats ? '✅' : '❌'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 max-w-xs overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-800">
            <div className="flex items-center space-x-2">
              <span className="text-sm">🐛</span>
              <span className="text-sm font-medium">Auth Debug</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-white text-xs"
                title="Minimize"
              >
                ⬇️
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white text-xs"
                title="Hide"
              >
                ❌
              </button>
            </div>
          </div>

          {/* Debug Content */}
          <div className="px-3 py-2 text-xs space-y-2 max-h-64 overflow-y-auto">
            <div className="space-y-1 mb-3">
              <div><strong>Current Role:</strong> <span className="text-blue-400">{currentRole}</span></div>
              <div><strong>Display Name:</strong> <span className="text-green-400">{roleDetails?.name}</span></div>
              <div><strong>Can Access Stats:</strong> {permissions?.canAccessStats ? '✅' : '❌'}</div>
            </div>
            
            <div className="border-t border-gray-700 pt-2 mb-3">
              <div className="text-gray-400 text-xs mb-1">LocalStorage:</div>
              <div className="font-mono text-xs space-y-1">
                <div>userRole: <span className="text-cyan-400">{devStorageValues.userRole || 'null'}</span></div>
                <div>devRole: <span className="text-cyan-400">{devStorageValues.devRole || 'null'}</span></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-2">
              <button 
                onClick={handleForceSync}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                🔄 Sync
              </button>
              
              <button 
                onClick={handleClearCache}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
              >
                🗑️ Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}