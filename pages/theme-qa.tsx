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
    { id: 'tabs', name: 'Tabs' },
    { id: 'banners', name: 'Banners' },
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

  const TabsShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Tab Navigation States</h3>
        <p className="text-text-secondary mb-4">
          Comprehensive tab system with proper focus, hover, active, and disabled states.
        </p>
      </div>

      <div>
        <h4 className="text-md font-semibold text-text-primary mb-3">Standard Tab Navigation</h4>
        <div className="tab-container p-1 rounded-lg">
          <div className="flex space-x-1">
            <button className="tab active px-4 py-2 text-sm font-medium rounded-md transition-all">
              Active Tab
            </button>
            <button className="tab px-4 py-2 text-sm font-medium rounded-md transition-all hover:bg-surface-2">
              Inactive Tab
            </button>
            <button className="tab px-4 py-2 text-sm font-medium rounded-md transition-all hover:bg-surface-2">
              Another Tab
            </button>
            <button className="tab disabled px-4 py-2 text-sm font-medium rounded-md opacity-60 cursor-not-allowed">
              Disabled Tab
            </button>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-text-primary mb-3">Enhanced Tab Navigation</h4>
        <div className="tab-enhanced">
          <div className="flex space-x-1">
            <button className="tab-trigger focusable" data-state="active">Canvas</button>
            <button className="tab-trigger focusable">Components</button>
            <button className="tab-trigger focusable">Themes</button>
            <button className="tab-trigger focusable" disabled>Disabled</button>
          </div>
        </div>
      </div>
    </div>
  );

  const BannersShowcase = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Information Banners</h3>
        <p className="text-text-secondary mb-4">
          Contextual banners with proper status colors, inline links, and accessibility features.
        </p>
      </div>

      <div className="space-y-4">
        <div className="info-banner rounded-lg p-4 flex items-start space-x-3">
          <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-medium mb-1">Information Banner</h5>
            <p className="text-sm">
              This is an informational message with <a href="#" className="underline hover:no-underline">inline links</a> for additional context.
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-start space-x-3" style={{ background: 'color-mix(in srgb, rgb(var(--success)) 10%, rgb(var(--bg)))', color: 'rgb(var(--success-foreground))' }}>
          <CheckIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--success))' }} />
          <div>
            <h5 className="font-medium mb-1">Success Banner</h5>
            <p className="text-sm">
              Your action was completed successfully. <a href="#" className="underline hover:no-underline">View details</a> or continue working.
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-start space-x-3" style={{ background: 'color-mix(in srgb, rgb(var(--warning)) 10%, rgb(var(--bg)))', color: 'rgb(var(--warning-foreground))' }}>
          <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--warning))' }} />
          <div>
            <h5 className="font-medium mb-1">Warning Banner</h5>
            <p className="text-sm">
              Please review these important changes. <a href="#" className="underline hover:no-underline">Learn more</a> about the implications.
            </p>
          </div>
        </div>

        <div className="rounded-lg p-4 flex items-start space-x-3" style={{ background: 'color-mix(in srgb, rgb(var(--destructive)) 10%, rgb(var(--bg)))', color: 'rgb(var(--destructive-foreground))' }}>
          <XMarkIcon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgb(var(--destructive))' }} />
          <div>
            <h5 className="font-medium mb-1">Error Banner</h5>
            <p className="text-sm">
              An error occurred while processing your request. <a href="#" className="underline hover:no-underline">Contact support</a> if the issue persists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const ButtonShowcase = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Complete Button Matrix</h3>
        <p className="text-text-secondary mb-6">
          All button variants in every state for comprehensive testing and accessibility validation.
        </p>

        {/* Button Matrix - All Variants x All States */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border">
            <thead>
              <tr className="bg-surface-2">
                <th className="border border-border p-3 text-left text-text-primary font-medium">Variant</th>
                <th className="border border-border p-3 text-center text-text-primary font-medium">Normal</th>
                <th className="border border-border p-3 text-center text-text-primary font-medium">Hover</th>
                <th className="border border-border p-3 text-center text-text-primary font-medium">Focus</th>
                <th className="border border-border p-3 text-center text-text-primary font-medium">Active</th>
                <th className="border border-border p-3 text-center text-text-primary font-medium">Disabled</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Primary</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-primary btn-md">Primary</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-primary btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-primary btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-primary btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-primary btn-md">Disabled</button>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Secondary</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-secondary btn-md">Secondary</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-secondary btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-secondary btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-secondary btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-secondary btn-md">Disabled</button>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Accent</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-accent btn-md">Accent</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-accent btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-accent btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-accent btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-accent btn-md">Disabled</button>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Destructive</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-destructive btn-md">Destructive</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-destructive btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-destructive btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-destructive btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-destructive btn-md">Disabled</button>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Ghost</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-ghost btn-md">Ghost</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-ghost btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-ghost btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-ghost btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-ghost btn-md">Disabled</button>
                </td>
              </tr>
              <tr>
                <td className="border border-border p-3 text-text-primary font-medium bg-surface">Outline</td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-outline btn-md">Outline</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-outline btn-md hover-darken-6">Hover</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-outline btn-md focusable">Focus</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button className="btn btn-outline btn-md active-darken-10">Active</button>
                </td>
                <td className="border border-border p-3 text-center">
                  <button disabled className="btn btn-outline btn-md">Disabled</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Button Sizes Comparison</h3>
        <div className="space-y-4">
          {['primary', 'secondary', 'outline'].map((variant) => (
            <div key={variant} className="flex items-center gap-4">
              <div className="w-20 text-sm text-text-secondary capitalize">{variant}:</div>
              <button className={`btn btn-${variant} btn-sm`}>Small</button>
              <button className={`btn btn-${variant} btn-md`}>Medium</button>
              <button className={`btn btn-${variant} btn-lg`}>Large</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Buttons with Icons</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <button className="btn btn-primary btn-md flex items-center gap-2">
            <HeartIcon className="w-4 h-4" />
            Like
          </button>
          <button className="btn btn-secondary btn-md flex items-center gap-2">
            <StarIcon className="w-4 h-4" />
            Favorite
          </button>
          <button className="btn btn-accent btn-md flex items-center gap-2">
            <EyeIcon className="w-4 h-4" />
            View
          </button>
          <button className="btn btn-destructive btn-md flex items-center gap-2">
            <TrashIcon className="w-4 h-4" />
            Delete
          </button>
          <button className="btn btn-ghost btn-md flex items-center gap-2">
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>
          <button className="btn btn-outline btn-md flex items-center gap-2">
            <CogIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Icon-Only Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary btn-md w-10 h-10 p-0 flex items-center justify-center">
            <BellIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-secondary btn-md w-10 h-10 p-0 flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-ghost btn-md w-10 h-10 p-0 flex items-center justify-center">
            <CogIcon className="w-4 h-4" />
          </button>
          <button className="btn btn-outline btn-md w-10 h-10 p-0 flex items-center justify-center">
            <PencilIcon className="w-4 h-4" />
          </button>
          <button disabled className="btn btn-primary btn-md w-10 h-10 p-0 flex items-center justify-center">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Loading State Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <button disabled className="btn btn-primary btn-md flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            Saving...
          </button>
          <button disabled className="btn btn-secondary btn-md flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary-foreground"></div>
            Loading...
          </button>
          <button disabled className="btn btn-outline btn-md flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Processing...
          </button>
        </div>
      </div>
    </div>
  );

  const InputShowcase = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Enhanced Input States</h3>
        <p className="text-text-secondary mb-6">
          Comprehensive input field variations showing filled, placeholder, error, disabled, and focus states for accessibility testing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Placeholder State
            </label>
            <input
              type="text"
              placeholder="Enter your email address..."
              className="input focusable"
            />
            <p className="text-xs text-text-tertiary mt-1">Empty field with placeholder text</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Filled State
            </label>
            <input
              type="text"
              value="john.doe@example.com"
              className="input focusable"
              readOnly
            />
            <p className="text-xs text-text-tertiary mt-1">Field with user input</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Focus State
            </label>
            <input
              type="text"
              placeholder="Click to focus..."
              className="input focusable ring-2 ring-ring"
            />
            <p className="text-xs text-text-tertiary mt-1">Active focus with ring indicator</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Error State
            </label>
            <input
              type="email"
              value="invalid-email"
              className="input ring-2 ring-destructive border-destructive"
            />
            <p className="text-xs text-destructive mt-1">Invalid email format</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Disabled State
            </label>
            <input
              type="text"
              placeholder="Disabled input"
              disabled
              className="input disabled"
            />
            <p className="text-xs text-text-tertiary mt-1">Non-interactive field</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Success State
            </label>
            <input
              type="email"
              value="user@example.com"
              className="input ring-2 ring-success border-success"
              readOnly
            />
            <p className="text-xs text-success mt-1">✓ Valid email address</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Input Types & Variations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Search Input
              </label>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search courses..."
                  className="input search-input pl-10 focusable"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-input-placeholder">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Password Input
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                className="input focusable"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Number Input
              </label>
              <input
                type="number"
                placeholder="Enter amount..."
                min="0"
                step="0.01"
                className="input focusable"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Textarea Field
              </label>
              <textarea
                rows={4}
                placeholder="Enter your message here..."
                className="input focusable resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Select Dropdown
              </label>
              <select className="input focusable">
                <option value="">Choose an option</option>
                <option value="beginner">Beginner Level</option>
                <option value="intermediate">Intermediate Level</option>
                <option value="advanced">Advanced Level</option>
              </select>
            </div>
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Alert Components</h3>
        <p className="text-text-secondary mb-4">
          Status alerts with proper color contrast and text readability across all themes.
        </p>
      </div>

      <div className="space-y-4">
        <div className="alert alert-info">
          <InformationCircleIcon className="w-5 h-5" />
          <div>
            <h4 className="font-medium text-info-foreground">Information Alert</h4>
            <p className="text-sm mt-1 text-info-foreground opacity-90">This is an informational alert with enhanced text contrast and readability.</p>
          </div>
        </div>

        <div className="alert alert-success">
          <CheckIcon className="w-5 h-5" />
          <div>
            <h4 className="font-medium text-success-foreground">Success Alert</h4>
            <p className="text-sm mt-1 text-success-foreground opacity-90">Your action was completed successfully! All changes have been saved.</p>
          </div>
        </div>

        <div className="alert alert-warning">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <div>
            <h4 className="font-medium text-warning-foreground">Warning Alert</h4>
            <p className="text-sm mt-1 text-warning-foreground opacity-90">Please review this important warning message before proceeding with your action.</p>
          </div>
        </div>

        <div className="alert alert-destructive">
          <XMarkIcon className="w-5 h-5" />
          <div>
            <h4 className="font-medium text-destructive-foreground">Error Alert</h4>
            <p className="text-sm mt-1 text-destructive-foreground opacity-90">An error occurred while processing your request. Please try again or contact support.</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Enhanced Alerts with Actions</h3>
        <div className="space-y-4">
          <div className="alert-enhanced alert-info">
            <InformationCircleIcon className="w-5 h-5" />
            <div className="flex-1">
              <h5 className="font-medium text-info-foreground">System Maintenance</h5>
              <p className="text-sm mt-1 text-info-foreground opacity-90">
                Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM EST.
              </p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs px-3 py-1 rounded bg-info/20 text-info-foreground hover:bg-info/30 transition-colors">
                  Learn More
                </button>
                <button className="text-xs px-3 py-1 rounded bg-transparent text-info-foreground hover:bg-info/10 transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <div className="alert-enhanced alert-success">
            <CheckIcon className="w-5 h-5" />
            <div className="flex-1">
              <h5 className="font-medium text-success-foreground">Course Completed!</h5>
              <p className="text-sm mt-1 text-success-foreground opacity-90">
                Congratulations! You've successfully completed "Advanced React Patterns".
              </p>
              <div className="mt-3 flex gap-2">
                <button className="text-xs px-3 py-1 rounded bg-success/20 text-success-foreground hover:bg-success/30 transition-colors">
                  View Certificate
                </button>
                <button className="text-xs px-3 py-1 rounded bg-transparent text-success-foreground hover:bg-success/10 transition-colors">
                  Next Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TableShowcase = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Enhanced Data Tables</h3>
        <p className="text-text-secondary mb-6">
          Tables with enhanced headers, hover states, and selection indicators using semantic tokens.
        </p>

        <div className="overflow-x-auto">
          <table className="table-enhanced w-full border-collapse border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="table-header-enhanced">
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-surface border-input rounded focusable" />
                </th>
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">Name</th>
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">Email</th>
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">Role</th>
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">Status</th>
                <th className="text-left p-4 font-medium text-text-secondary border-b border-border">Last Login</th>
                <th className="text-center p-4 font-medium text-text-secondary border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="table-row-enhanced hover:bg-surface-2 transition-colors">
                <td className="p-4">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-surface border-input rounded focusable" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">John Doe</div>
                      <div className="text-xs text-text-tertiary">ID: 12345</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">john.doe@example.com</td>
                <td className="p-4">
                  <div className="badge badge-primary">Admin</div>
                </td>
                <td className="p-4">
                  <div className="badge badge-success">Active</div>
                </td>
                <td className="p-4 text-text-secondary text-sm">2 hours ago</td>
                <td className="p-4">
                  <div className="flex justify-center gap-1">
                    <button className="btn btn-ghost btn-sm focusable" title="Edit user">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive focusable" title="Delete user">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="table-row-enhanced hover:bg-surface-2 transition-colors">
                <td className="p-4">
                  <input type="checkbox" className="w-4 h-4 text-primary bg-surface border-input rounded focusable" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">Jane Smith</div>
                      <div className="text-xs text-text-tertiary">ID: 67890</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">jane.smith@example.com</td>
                <td className="p-4">
                  <div className="badge badge-secondary">Instructor</div>
                </td>
                <td className="p-4">
                  <div className="badge badge-warning">Pending</div>
                </td>
                <td className="p-4 text-text-secondary text-sm">1 day ago</td>
                <td className="p-4">
                  <div className="flex justify-center gap-1">
                    <button className="btn btn-ghost btn-sm focusable" title="Edit user">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive focusable" title="Delete user">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="table-row-enhanced selected">
                <td className="p-4">
                  <input type="checkbox" checked className="w-4 h-4 text-primary bg-surface border-input rounded focusable" />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">Bob Johnson</div>
                      <div className="text-xs text-text-tertiary">ID: 11111</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-text-secondary">bob.johnson@example.com</td>
                <td className="p-4">
                  <div className="badge badge-accent">Student</div>
                </td>
                <td className="p-4">
                  <div className="badge badge-destructive">Suspended</div>
                </td>
                <td className="p-4 text-text-secondary text-sm">3 weeks ago</td>
                <td className="p-4">
                  <div className="flex justify-center gap-1">
                    <button className="btn btn-ghost btn-sm focusable" title="Edit user">
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button className="btn btn-ghost btn-sm text-destructive focusable" title="Delete user">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-3">Compact Table Variation</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-sm font-medium text-text-secondary">Course</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-text-secondary">Progress</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-text-secondary">Grade</th>
                <th className="text-left py-2 px-3 text-sm font-medium text-text-secondary">Due Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border hover:bg-surface transition-colors">
                <td className="py-2 px-3 text-sm text-text-primary">React Fundamentals</td>
                <td className="py-2 px-3">
                  <div className="progress-container">
                    <div className="progress-enhanced w-20">
                      <div className="progress-bar" style={{width: '85%'}}></div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className="badge badge-success">A+</span>
                </td>
                <td className="py-2 px-3 text-sm text-text-secondary">Dec 15, 2024</td>
              </tr>
              <tr className="border-b border-border hover:bg-surface transition-colors">
                <td className="py-2 px-3 text-sm text-text-primary">Advanced JavaScript</td>
                <td className="py-2 px-3">
                  <div className="progress-container">
                    <div className="progress-enhanced w-20">
                      <div className="progress-bar" style={{width: '60%'}}></div>
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 text-sm">
                  <span className="badge badge-warning">B</span>
                </td>
                <td className="py-2 px-3 text-sm text-text-secondary">Jan 20, 2025</td>
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
      case 'tabs': return <TabsShowcase />;
      case 'banners': return <BannersShowcase />;
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