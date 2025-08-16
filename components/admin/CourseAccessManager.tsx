import { useState } from 'react';
import { useCourseAccess } from '../../contexts/CourseAccessContext';
import { ROLE_DETAILS, UserRole } from '../../contexts/UserRoleContext';

const COURSE_NAMES: Record<string, string> = {
  'business-blueprint': 'The Business Blueprint',
  'discovery-process': 'Discovery Process',
  'next-steps': 'Next Steps Guide',
  'email-marketing-secrets': 'Email Marketing Secrets',
  'sales-funnel-mastery': 'Sales Funnel Mastery',
  'content-creation-system': 'Content Creation System',
  'conversion-optimization': 'Conversion Optimization',
  'traffic-generation': 'Traffic Generation',
  'advanced-copywriting-masterclass': 'Advanced Copywriting Masterclass',
  'scaling-systems-masterclass': 'Scaling Systems Masterclass',
  'welcome-orientation': 'Welcome Orientation',
};

const CATEGORY_COLORS = {
  'start-here': 'bg-green-100 text-green-800',
  'all-access': 'bg-blue-100 text-blue-800',
  'masterclass': 'bg-purple-100 text-purple-800',
  'free-intro': 'bg-gray-100 text-gray-800',
};

const CATEGORY_NAMES = {
  'start-here': 'Start Here',
  'all-access': 'All Access',
  'masterclass': 'Masterclass',
  'free-intro': 'Free Intro',
};

export default function CourseAccessManager() {
  const { courseConfigs, updateCourseAccess } = useCourseAccess();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  const handleAddOverride = (courseId: string, allowedRoles: UserRole[]) => {
    updateCourseAccess(courseId, {
      adminOverride: {
        allowedRoles: allowedRoles as string[],
        isOverridden: true,
      }
    });
    setShowOverrideModal(false);
    setSelectedCourse(null);
  };

  const handleRemoveOverride = (courseId: string) => {
    updateCourseAccess(courseId, {
      adminOverride: {
        allowedRoles: [],
        isOverridden: false,
      }
    });
  };

  const OverrideModal = () => {
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([]);
    const availableRoles: UserRole[] = ['free', 'trial', 'monthly', 'annual', 'downsell'];

    if (!selectedCourse) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl max-w-md w-full p-6 m-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Override Access for {COURSE_NAMES[selectedCourse]}
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Select which roles should have access to this course, even if they normally wouldn't:
          </p>

          <div className="space-y-2 mb-6">
            {availableRoles.map(role => (
              <label key={role} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRoles([...selectedRoles, role]);
                    } else {
                      setSelectedRoles(selectedRoles.filter(r => r !== role));
                    }
                  }}
                  className="mr-3"
                />
                <span className="text-sm font-medium">{ROLE_DETAILS[role].name}</span>
              </label>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleAddOverride(selectedCourse, selectedRoles)}
              disabled={selectedRoles.length === 0}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply Override
            </button>
            <button
              onClick={() => {
                setShowOverrideModal(false);
                setSelectedCourse(null);
                setSelectedRoles([]);
              }}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Course Access Management</h3>
          <div className="text-sm text-gray-600">
            <i className="fas fa-info-circle mr-1"></i>
            Override normal access restrictions for specific user roles
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4">
          {courseConfigs.map((config) => (
            <div
              key={config.courseId}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium text-gray-900">
                      {COURSE_NAMES[config.courseId] || config.courseId}
                    </h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      CATEGORY_COLORS[config.category]
                    }`}>
                      {CATEGORY_NAMES[config.category]}
                    </span>
                  </div>

                  {config.adminOverride?.isOverridden && (
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="fas fa-shield-alt text-orange-500 text-sm"></i>
                      <span className="text-sm text-orange-600 font-medium">
                        Override Active
                      </span>
                      <div className="text-xs text-gray-500">
                        Additional access: {config.adminOverride.allowedRoles.map(role => 
                          ROLE_DETAILS[role as UserRole]?.name || role
                        ).join(', ')}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    Normal access: {config.category === 'start-here' ? 'Trial+ members' : 
                                    config.category === 'all-access' ? 'Monthly/Annual members' :
                                    config.category === 'masterclass' ? 'Separate purchase' :
                                    'All members'}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {config.adminOverride?.isOverridden ? (
                    <button
                      onClick={() => handleRemoveOverride(config.courseId)}
                      className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
                    >
                      Remove Override
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedCourse(config.courseId);
                        setShowOverrideModal(true);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded hover:bg-blue-200 transition-colors"
                    >
                      Add Override
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Course Categories:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span><strong>Start Here:</strong> Trial+ access</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span><strong>All Access:</strong> Monthly/Annual</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span><strong>Masterclass:</strong> Separate purchase</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
              <span><strong>Free Intro:</strong> Everyone</span>
            </div>
          </div>
        </div>
      </div>

      {showOverrideModal && <OverrideModal />}
    </div>
  );
}