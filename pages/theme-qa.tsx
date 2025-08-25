import React, { useState } from 'react';
import { useTheme, useThemeCanvasV1, useThemeCanvasClass } from '../contexts/ThemeContext';
import ThemeSelector from '../components/theme/ThemeSelector';
import {
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  HeartIcon,
  StarIcon,
  UserIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

export default function ThemeQA() {
  const { theme } = useTheme();
  const [tabActive, setTabActive] = useState('canvas');
  const [progress] = useState(65);
  const [toggleState, setToggleState] = useState(false);
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioState, setRadioState] = useState('option1');

  // Theme canvas integration
  const canvasEnabled = useThemeCanvasV1();
  const pageCanvasClass = useThemeCanvasClass('page-canvas', 'min-h-screen bg-bg');

  const sections = [
    { id: 'canvas', name: 'Page Canvas' },
    { id: 'buttons', name: 'Buttons' },
    { id: 'inputs', name: 'Inputs' },
    { id: 'cards', name: 'Cards' },
    { id: 'badges', name: 'Badges' },
    { id: 'alerts', name: 'Alerts' },
    { id: 'tables', name: 'Tables' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'feedback', name: 'Feedback' },
  ];

  const CanvasShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Page Canvas System</h3>
        <p className="text-text-secondary mb-4">
          The page canvas system provides enhanced theming for main content areas with semantic tokens.
          Feature flag: <span className="font-mono text-sm bg-surface-2 px-2 py-1 rounded">THEME_CANVAS_V1={canvasEnabled.toString()}</span>
        </p>
      </div>

      <div>
        <h4 className="text-md font-semibold text-text-primary mb-3">Page Canvas Container</h4>
        <div className="page-canvas p-6 rounded-xl min-h-24 border border-page-border">
          <p className="text-text-primary">This container uses page-canvas class with semantic tokens:</p>
          <ul className="text-sm text-text-secondary mt-2 space-y-1">
            <li>• Background: <code className="text-xs bg-surface-2 px-1 rounded">var(--page-bg)</code></li>
            <li>• Border: <code className="text-xs bg-surface-2 px-1 rounded">var(--page-border)</code></li>
            <li>• Shadow: <code className="text-xs bg-surface-2 px-1 rounded">var(--page-shadow-color)</code></li>
          </ul>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-text-primary mb-3">Enhanced Components</h4>
        <div className="space-y-4">
          {/* Page Banner */}
          <div className="page-banner">
            <h5 className="font-semibold text-text-primary mb-2">Page Banner Component</h5>
            <p className="text-text-secondary mb-4">Enhanced banner with gradient backgrounds and theme-aware styling.</p>
            <button className="btn btn-primary btn-md">Call to Action</button>
          </div>

          {/* Card Grid */}
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Card Grid</h5>
            <div className="card-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="card-item hover-overlay">
                <h6 className="font-medium text-text-primary mb-2">Course Card</h6>
                <p className="text-sm text-text-secondary mb-3">Enhanced with hover overlays and theme-aware shadows.</p>
                <div className="progress-container">
                  <div className="progress-enhanced">
                    <div className="progress-bar" style={{width: '65%'}}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">65% Complete</p>
                </div>
              </div>
              <div className="card-item hover-overlay">
                <h6 className="font-medium text-text-primary mb-2">Feature Card</h6>
                <p className="text-sm text-text-secondary mb-3">Consistent styling across all themes.</p>
                <div className="badge badge-primary">Featured</div>
              </div>
              <div className="card-item hover-overlay">
                <h6 className="font-medium text-text-primary mb-2">Interactive Card</h6>
                <p className="text-sm text-text-secondary mb-3">Hover to see the overlay effect.</p>
                <button className="btn btn-outline btn-sm">Learn More</button>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="form-container">
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Form Container</h5>
            <div className="space-y-3">
              <input className="input-enhanced" placeholder="Enhanced input with theme styling" />
              <textarea className="input-enhanced" rows={3} placeholder="Enhanced textarea"></textarea>
              <button className="btn btn-primary btn-md">Submit Form</button>
            </div>
          </div>

          {/* Enhanced Table */}
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Table</h5>
            <div className="table-enhanced">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-4">Feature</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Theme</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4">Page Canvas</td>
                    <td className="p-4"><span className="badge badge-success">Active</span></td>
                    <td className="p-4">{theme}</td>
                  </tr>
                  <tr>
                    <td className="p-4">Enhanced Cards</td>
                    <td className="p-4"><span className="badge badge-success">Active</span></td>
                    <td className="p-4">{theme}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Enhanced Alerts */}
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Alerts</h5>
            <div className="space-y-3">
              <div className="alert-enhanced alert-info">
                <InformationCircleIcon className="w-5 h-5" />
                <div>
                  <h6 className="font-medium">Information Alert</h6>
                  <p className="text-sm">Enhanced alert with theme-aware styling and border accent.</p>
                </div>
              </div>
              <div className="alert-enhanced alert-success">
                <CheckIcon className="w-5 h-5" />
                <div>
                  <h6 className="font-medium">Success Alert</h6>
                  <p className="text-sm">Page canvas system successfully implemented!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Tab Navigation</h5>
            <div className="tab-enhanced">
              <div className="flex space-x-1">
                <button className="tab-trigger" data-state="active">Canvas</button>
                <button className="tab-trigger">Components</button>
                <button className="tab-trigger">Themes</button>
              </div>
            </div>
          </div>

          {/* Toast Example */}
          <div>
            <h5 className="font-semibold text-text-primary mb-3">Enhanced Toast</h5>
            <div className="toast-enhanced">
              <div className="flex items-center space-x-3">
                <CheckIcon className="w-5 h-5 text-success" />
                <div>
                  <h6 className="font-medium text-text-primary">Theme Applied</h6>
                  <p className="text-sm text-text-secondary">Page canvas system is now active!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ButtonShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Button Variants</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary btn-md">Primary Button</button>
          <button className="btn btn-secondary btn-md">Secondary Button</button>
          <button className="btn btn-ghost btn-md">Ghost Button</button>
          <button className="btn btn-destructive btn-md">Destructive Button</button>
          <button className="btn btn-outline btn-md">Outline Button</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Button States</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-text-secondary mb-2">Normal</p>
            <button className="btn btn-primary btn-md w-full">Button</button>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-2">Hover (CSS :hover)</p>
            <button className="btn btn-primary btn-md w-full hover:opacity-90">Hover State</button>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-2">Focus</p>
            <button className="btn btn-primary btn-md w-full focus:ring-2 focus:ring-ring">Focus State</button>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-2">Disabled</p>
            <button disabled className="btn btn-primary btn-md w-full">Disabled</button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Button Sizes</h3>
        <div className="flex items-center gap-3">
          <button className="btn btn-primary btn-sm">Small</button>
          <button className="btn btn-primary btn-md">Medium</button>
          <button className="btn btn-primary btn-lg">Large</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Buttons with Icons</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary btn-md">
            <HeartIcon className="w-4 h-4" />
            Like
          </button>
          <button className="btn btn-secondary btn-md">
            <StarIcon className="w-4 h-4" />
            Favorite
          </button>
          <button className="btn btn-ghost btn-md">
            <EyeIcon className="w-4 h-4" />
            View
          </button>
          <button className="btn btn-destructive btn-md">
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const InputShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Text Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Normal Input
            </label>
            <input
              type="text"
              placeholder="Enter text here..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Focused Input
            </label>
            <input
              type="text"
              placeholder="This input is focused"
              className="input ring-2 ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Disabled Input
            </label>
            <input
              type="text"
              placeholder="Disabled input"
              disabled
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Error State
            </label>
            <input
              type="text"
              placeholder="Error state"
              className="input ring-2 ring-destructive"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Form Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="checkbox"
                checked={checkboxState}
                onChange={(e) => setCheckboxState(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface border-input rounded focus:ring-2 focus:ring-ring"
              />
              <label htmlFor="checkbox" className="text-sm text-text-primary">
                Checkbox option
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="radio1"
                  name="radio"
                  value="option1"
                  checked={radioState === 'option1'}
                  onChange={(e) => setRadioState(e.target.value)}
                  className="w-4 h-4 text-primary bg-surface border-input focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="radio1" className="text-sm text-text-primary">
                  Radio option 1
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="radio2"
                  name="radio"
                  value="option2"
                  checked={radioState === 'option2'}
                  onChange={(e) => setRadioState(e.target.value)}
                  className="w-4 h-4 text-primary bg-surface border-input focus:ring-2 focus:ring-ring"
                />
                <label htmlFor="radio2" className="text-sm text-text-primary">
                  Radio option 2
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Dropdown
            </label>
            <select className="input">
              <option>Choose an option</option>
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Toggle Switch</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setToggleState(!toggleState)}
            className={`
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
              ${toggleState ? 'bg-primary' : 'bg-muted'}
            `}
          >
            <span
              className={`
                pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                transition duration-200 ease-in-out
                ${toggleState ? 'translate-x-5' : 'translate-x-0'}
              `}
            />
          </button>
          <span className="text-sm text-text-primary">
            Toggle is {toggleState ? 'on' : 'off'}
          </span>
        </div>
      </div>
    </div>
  );

  const CardShowcase = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Basic Card</h3>
          <p className="text-text-secondary mb-4">
            This is a basic card component with some content and actions.
          </p>
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm">Action</button>
            <button className="btn btn-ghost btn-sm">Cancel</button>
          </div>
        </div>

        <div className="card bg-surface-2">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Elevated Card</h3>
          <p className="text-text-secondary mb-4">
            This card uses a different surface level for visual hierarchy.
          </p>
          <div className="flex items-center gap-2 text-sm text-text-tertiary">
            <UserIcon className="w-4 h-4" />
            By John Doe
          </div>
        </div>

        <div className="card border-primary">
          <h3 className="text-lg font-semibold text-text-primary mb-2">Highlighted Card</h3>
          <p className="text-text-secondary mb-4">
            This card has a colored border for emphasis.
          </p>
          <div className="badge badge-primary">Featured</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Stats Cards</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary mb-1">1,234</div>
            <div className="text-sm text-text-secondary">Total Users</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-success mb-1">98.5%</div>
            <div className="text-sm text-text-secondary">Uptime</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-warning mb-1">45</div>
            <div className="text-sm text-text-secondary">Pending</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-destructive mb-1">3</div>
            <div className="text-sm text-text-secondary">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );

  const BadgeShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Badge Variants</h3>
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-default">Default</div>
          <div className="badge badge-primary">Primary</div>
          <div className="badge badge-success">Success</div>
          <div className="badge badge-warning">Warning</div>
          <div className="badge badge-destructive">Error</div>
          <div className="badge badge-info">Info</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Badges with Icons</h3>
        <div className="flex flex-wrap gap-2">
          <div className="badge badge-success">
            <CheckIcon className="w-3 h-3" />
            Completed
          </div>
          <div className="badge badge-warning">
            <ExclamationTriangleIcon className="w-3 h-3" />
            Warning
          </div>
          <div className="badge badge-destructive">
            <XMarkIcon className="w-3 h-3" />
            Failed
          </div>
          <div className="badge badge-info">
            <InformationCircleIcon className="w-3 h-3" />
            Info
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Status Badges</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="badge badge-success">Active</div>
            <span className="text-text-secondary">User account is active</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge badge-warning">Pending</div>
            <span className="text-text-secondary">Awaiting approval</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="badge badge-destructive">Suspended</div>
            <span className="text-text-secondary">Account suspended</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AlertShowcase = () => (
    <div className="space-y-4">
      <div className="alert alert-info">
        <InformationCircleIcon className="w-5 h-5" />
        <div>
          <h4 className="font-medium">Information</h4>
          <p className="text-sm mt-1">This is an informational alert with some helpful content.</p>
        </div>
      </div>

      <div className="alert alert-success">
        <CheckIcon className="w-5 h-5" />
        <div>
          <h4 className="font-medium">Success</h4>
          <p className="text-sm mt-1">Your action was completed successfully!</p>
        </div>
      </div>

      <div className="alert alert-warning">
        <ExclamationTriangleIcon className="w-5 h-5" />
        <div>
          <h4 className="font-medium">Warning</h4>
          <p className="text-sm mt-1">Please review this important warning message.</p>
        </div>
      </div>

      <div className="alert alert-destructive">
        <XMarkIcon className="w-5 h-5" />
        <div>
          <h4 className="font-medium">Error</h4>
          <p className="text-sm mt-1">An error occurred while processing your request.</p>
        </div>
      </div>
    </div>
  );

  const TableShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Data Table</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    John Doe
                  </div>
                </td>
                <td>john@example.com</td>
                <td>Admin</td>
                <td>
                  <div className="badge badge-success">Active</div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    Jane Smith
                  </div>
                </td>
                <td>jane@example.com</td>
                <td>User</td>
                <td>
                  <div className="badge badge-warning">Pending</div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-sm">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const NavigationShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Tabs</h3>
        <div className="tab-list">
          <button
            className={`tab-trigger ${tabActive === 'buttons' ? 'data-[state=active]' : ''}`}
            onClick={() => setTabActive('buttons')}
            data-state={tabActive === 'buttons' ? 'active' : 'inactive'}
          >
            Buttons
          </button>
          <button
            className={`tab-trigger ${tabActive === 'inputs' ? 'data-[state=active]' : ''}`}
            onClick={() => setTabActive('inputs')}
            data-state={tabActive === 'inputs' ? 'active' : 'inactive'}
          >
            Inputs
          </button>
          <button
            className={`tab-trigger ${tabActive === 'cards' ? 'data-[state=active]' : ''}`}
            onClick={() => setTabActive('cards')}
            data-state={tabActive === 'cards' ? 'active' : 'inactive'}
          >
            Cards
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Breadcrumbs</h3>
        <nav className="flex items-center gap-2 text-sm">
          <a href="#" className="text-primary hover:underline">Home</a>
          <span className="text-text-tertiary">/</span>
          <a href="#" className="text-primary hover:underline">Components</a>
          <span className="text-text-tertiary">/</span>
          <span className="text-text-secondary">Theme QA</span>
        </nav>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Pagination</h3>
        <div className="flex items-center gap-2">
          <button className="btn btn-outline btn-sm" disabled>Previous</button>
          <button className="btn btn-primary btn-sm">1</button>
          <button className="btn btn-ghost btn-sm">2</button>
          <button className="btn btn-ghost btn-sm">3</button>
          <span className="text-text-tertiary">...</span>
          <button className="btn btn-ghost btn-sm">10</button>
          <button className="btn btn-outline btn-sm">Next</button>
        </div>
      </div>
    </div>
  );

  const FeedbackShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Progress Bar</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-text-primary">Progress</span>
            <span className="text-text-secondary">{progress}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-bar" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Loading States</h3>
        <div className="space-y-4">
          <button className="btn btn-primary btn-md" disabled>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading...
          </button>
          
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Tooltips (Hover simulation)</h3>
        <div className="flex gap-4">
          <div className="relative group">
            <button className="btn btn-primary btn-md">Hover me</button>
            <div className="tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
              This is a tooltip
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Empty State</h3>
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
            <CogIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-text-primary mb-2">No data available</h3>
          <p className="text-text-secondary mb-4">Get started by creating your first item.</p>
          <button className="btn btn-primary btn-md">Create Item</button>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (tabActive) {
      case 'canvas': return <CanvasShowcase />;
      case 'buttons': return <ButtonShowcase />;
      case 'inputs': return <InputShowcase />;
      case 'cards': return <CardShowcase />;
      case 'badges': return <BadgeShowcase />;
      case 'alerts': return <AlertShowcase />;
      case 'tables': return <TableShowcase />;
      case 'navigation': return <NavigationShowcase />;
      case 'feedback': return <FeedbackShowcase />;
      default: return <CanvasShowcase />;
    }
  };

  return (
    <div className={pageCanvasClass}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-text-primary mb-2">
            Theme QA Showcase
          </h1>
          <p className="text-text-secondary mb-6">
            Comprehensive review of all UI components across all themes. 
            Current theme: <span className="font-medium text-text-primary">{theme}</span>
            {canvasEnabled && <span className="ml-4 text-xs bg-success/20 text-success-foreground px-2 py-1 rounded-full">Canvas System Active</span>}
          </p>
          <ThemeSelector variant="compact" className="mb-6" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className={canvasEnabled ? "page-content sticky top-6 p-6" : "card sticky top-6"}>
              <h2 className="text-lg font-semibold text-text-primary mb-4">Components</h2>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setTabActive(section.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-lg transition-colors duration-200
                      ${tabActive === section.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-text-secondary hover:bg-surface-2 hover:text-text-primary'
                      }
                    `}
                  >
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className={canvasEnabled ? "page-content p-6" : "card"}>
              {renderSection()}
            </div>
          </div>
        </div>

        <div className={canvasEnabled ? "mt-8 page-content p-4" : "mt-8 p-4 bg-surface-2 rounded-xl"}>
          <h3 className="text-lg font-semibold text-text-primary mb-2">Accessibility & Canvas Notes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-text-primary mb-2">Accessibility</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• All color combinations meet WCAG AA contrast requirements</li>
                <li>• Focus states are clearly visible with ring indicators</li>
                <li>• Interactive elements have proper hover and active states</li>
                <li>• Status information is conveyed through icons and text, not color alone</li>
                <li>• The High Contrast theme provides enhanced visibility</li>
              </ul>
            </div>
            {canvasEnabled && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Canvas System</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Page canvas provides semantic theming tokens</li>
                  <li>• Enhanced components with consistent visual hierarchy</li>
                  <li>• Hover overlays with color mixing for better UX</li>
                  <li>• Feature flag controlled for safe migration</li>
                  <li>• All themes support canvas-specific styling</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}