import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Zap, 
  Users, 
  ShoppingCart, 
  Video,
  Target,
  Settings,
  Eye
} from 'lucide-react';
import { CreateFunnelRequest, Funnel } from '../../types/affiliate';

interface FunnelCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (funnelData: CreateFunnelRequest) => Promise<void>;
  loading?: boolean;
}

interface FunnelTemplate {
  id: string;
  name: string;
  type: Funnel['type'];
  description: string;
  icon: React.ReactNode;
  features: string[];
  conversionRate: string;
  preview: string;
}

const funnelTemplates: FunnelTemplate[] = [
  {
    id: 'lead-magnet-basic',
    name: 'Lead Magnet',
    type: 'lead-magnet',
    description: 'Capture leads with a valuable free resource',
    icon: <Zap className="w-6 h-6" />,
    features: ['Email capture', 'Download delivery', 'Thank you page', 'Email automation'],
    conversionRate: '25-40%',
    preview: '/templates/lead-magnet-preview.jpg'
  },
  {
    id: 'sales-page-basic',
    name: 'Sales Page',
    type: 'sales-page',
    description: 'Convert visitors into customers with persuasive sales copy',
    icon: <ShoppingCart className="w-6 h-6" />,
    features: ['Sales copy', 'Payment integration', 'Testimonials', 'Urgency elements'],
    conversionRate: '5-15%',
    preview: '/templates/sales-page-preview.jpg'
  },
  {
    id: 'webinar-funnel',
    name: 'Webinar Funnel',
    type: 'webinar',
    description: 'Register attendees and sell through live or automated webinars',
    icon: <Video className="w-6 h-6" />,
    features: ['Registration page', 'Webinar hosting', 'Replay page', 'Follow-up sequences'],
    conversionRate: '15-30%',
    preview: '/templates/webinar-preview.jpg'
  },
  {
    id: 'course-promo',
    name: 'Course Promotion',
    type: 'course-promo',
    description: 'Promote and sell online courses with multi-step funnels',
    icon: <Target className="w-6 h-6" />,
    features: ['Course preview', 'Curriculum display', 'Student testimonials', 'Payment plans'],
    conversionRate: '8-20%',
    preview: '/templates/course-promo-preview.jpg'
  }
];

export const FunnelCreationModal: React.FC<FunnelCreationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null>(null);
  const [formData, setFormData] = useState<CreateFunnelRequest>({
    name: '',
    description: '',
    type: 'lead-magnet',
    affiliateCommission: 25,
    landingPageUrl: '',
    thankYouPageUrl: '',
    productIds: [],
    targetAudienceSegment: ''
  });

  const totalSteps = 3;

  const resetModal = () => {
    setCurrentStep(1);
    setSelectedTemplate(null);
    setFormData({
      name: '',
      description: '',
      type: 'lead-magnet',
      affiliateCommission: 25,
      landingPageUrl: '',
      thankYouPageUrl: '',
      productIds: [],
      targetAudienceSegment: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTemplateSelect = (template: FunnelTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      type: template.type,
      name: template.name
    }));
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) return;
    
    try {
      await onSubmit({
        ...formData,
        type: selectedTemplate.type
      });
      handleClose();
    } catch (error) {
      console.error('Failed to create funnel:', error);
    }
  };

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedTemplate !== null;
      case 2:
        return formData.name.trim() !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Funnel
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                    ${step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                    }
                  `}>
                    {step < currentStep ? <Check className="w-4 h-4" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div className={`
                      h-1 w-12 mx-2
                      ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Choose Template</span>
              <span>Basic Info</span>
              <span>Configuration</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Step 1: Template Selection */}
            {currentStep === 1 && (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Choose a Funnel Template
                  </h4>
                  <p className="text-gray-600">
                    Select a template that matches your marketing goals. You can customize it later.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {funnelTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTemplateSelect(template)}
                      className={`
                        relative p-6 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md
                        ${selectedTemplate?.id === template.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {selectedTemplate?.id === template.id && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-4">
                        <div className={`
                          p-3 rounded-lg
                          ${selectedTemplate?.id === template.id ? 'bg-blue-100' : 'bg-gray-100'}
                        `}>
                          {template.icon}
                        </div>
                        
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {template.name}
                          </h5>
                          <p className="text-sm text-gray-600 mb-3">
                            {template.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-green-600 font-medium">
                              Avg. Conv. Rate: {template.conversionRate}
                            </span>
                          </div>

                          <div className="space-y-1">
                            {template.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-xs text-gray-600">
                                <Check className="w-3 h-3 mr-2 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {currentStep === 2 && (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Basic Information
                  </h4>
                  <p className="text-gray-600">
                    Provide the basic details for your funnel.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funnel Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter a descriptive name for your funnel"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      placeholder="Describe the purpose and goals of this funnel"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <select
                      value={formData.targetAudienceSegment}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudienceSegment: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select target audience</option>
                      <option value="entrepreneurs">Entrepreneurs</option>
                      <option value="marketers">Digital Marketers</option>
                      <option value="business-owners">Business Owners</option>
                      <option value="freelancers">Freelancers</option>
                      <option value="students">Students</option>
                      <option value="professionals">Professionals</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Configuration */}
            {currentStep === 3 && (
              <div>
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Configuration
                  </h4>
                  <p className="text-gray-600">
                    Configure the technical settings for your funnel.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliate Commission Rate (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.affiliateCommission}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        affiliateCommission: parseInt(e.target.value) || 0 
                      }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landing Page URL (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourdomain.com/landing-page"
                      value={formData.landingPageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, landingPageUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thank You Page URL (optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourdomain.com/thank-you"
                      value={formData.thankYouPageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, thankYouPageUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Template Preview */}
                  {selectedTemplate && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-2">Selected Template</h5>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white rounded-lg">
                          {selectedTemplate.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedTemplate.name}</p>
                          <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!canProceedFromStep(currentStep)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading || !canProceedFromStep(currentStep)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Create Funnel
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelCreationModal;