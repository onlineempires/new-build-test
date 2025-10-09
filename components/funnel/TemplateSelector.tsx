import { useState, useEffect } from 'react';
import { X, Zap, Eye, Search } from 'lucide-react';
import type { FunnelTemplate, UserTemplate } from '../../types/funnel';
import { funnelApi } from '../../lib/api/funnel';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: FunnelTemplate | UserTemplate, isUserTemplate: boolean) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelect }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
  const [userTemplates, setUserTemplates] = useState<UserTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'admin' | 'personal'>('admin');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      const [adminData, userData] = await Promise.all([
        funnelApi.adminTemplate.getTemplates(),
        funnelApi.userTemplate.getTemplates(),
      ]);

      setTemplates(adminData);
      setUserTemplates(userData);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: FunnelTemplate | UserTemplate) => {
    const isUserTemplate = 'user_id' in template;
    onSelect(template, isUserTemplate);
    onClose();
  };

  const filteredTemplates = () => {
    const currentTemplates = activeTab === 'admin' ? templates : userTemplates;

    return currentTemplates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' ||
        template.category?.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory && template.is_active;
    });
  };

  const categories = [
    ...new Set([
      ...templates.map((t) => t.category).filter(Boolean),
      ...userTemplates.map((t) => t.category).filter(Boolean),
    ]),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
            <p className="mt-1 text-gray-600">
              Start with a pre-designed template or create from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs and Filters */}
        <div className="border-b border-gray-200 p-6">
          <div className="mb-4 flex items-center justify-between">
            {/* Tabs */}
            <div className="flex space-x-1 rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setActiveTab('admin')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                System Templates ({templates.filter((t) => t.is_active).length})
              </button>
              <button
                onClick={() => setActiveTab('personal')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  activeTab === 'personal'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Templates ({userTemplates.filter((t) => t.is_active).length})
              </button>
            </div>

            {/* Blank Template Option */}
            <button
              onClick={() => onSelect({} as any, false)}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Start from Blank
            </button>
          </div>

          {/* Search and Category Filter */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category || ''}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Template Grid */}
        <div className="max-h-96 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredTemplates().length === 0 ? (
            <div className="py-12 text-center">
              <Zap className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {searchTerm || selectedCategory !== 'all'
                  ? 'No matching templates'
                  : 'No templates available'}
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : activeTab === 'personal'
                    ? 'Create your first personal template by saving an existing funnel'
                    : 'Contact your administrator to set up templates'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates().map((template) => (
                <div
                  key={template.id}
                  className="cursor-pointer rounded-xl border-2 border-transparent bg-gray-50 p-6 transition-all hover:border-blue-200 hover:shadow-lg"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {/* Preview Image */}
                  <div className="relative mb-4 flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    {template.preview_image_url ? (
                      <>
                        <img
                          src={template.preview_image_url}
                          alt={template.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="absolute inset-0 flex hidden items-center justify-center text-center text-white">
                          <div>
                            <Zap className="mx-auto mb-2 h-8 w-8" />
                            <p className="text-sm font-medium">Template Preview</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-white">
                        <Zap className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-sm font-medium">Template Preview</p>
                      </div>
                    )}

                    {/* Category Badge */}
                    {template.category && (
                      <div className="absolute right-2 top-2 rounded-full bg-black bg-opacity-70 px-2 py-1 text-xs text-white">
                        {template.category}
                      </div>
                    )}
                  </div>

                  {/* Template Info */}
                  <div>
                    <h3 className="mb-2 font-semibold text-gray-900">{template.name}</h3>
                    {template.description && (
                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {template.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {activeTab === 'admin' ? 'System Template' : 'Personal Template'}
                      </span>
                      <button className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-700">
                        <Eye className="h-4 w-4" />
                        <span>Use Template</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
