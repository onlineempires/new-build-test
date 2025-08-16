import { getEnvironmentName, isDevelopment } from '../../utils/environment';

/**
 * Environment Indicator component
 * Shows current environment in development mode only
 */
export default function EnvironmentIndicator() {
  if (!isDevelopment()) return null;

  const envName = getEnvironmentName();
  
  return (
    <div className="fixed top-2 right-2 z-50">
      <div className="bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
        <i className="fas fa-code mr-1"></i>
        {envName} Mode
      </div>
    </div>
  );
}