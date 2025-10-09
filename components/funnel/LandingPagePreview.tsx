import type { CreateMemberFunnel } from '@/shared/types';
import { DynamicIcon } from '@/react-app/utils/iconMapping';

interface LandingPagePreviewProps {
  formData: CreateMemberFunnel;
}

export default function LandingPagePreview({ formData }: LandingPagePreviewProps) {
  // Add safety check for formData
  if (!formData) {
    return (
      <div className="sticky top-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Landing Page Preview</h2>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only show if email capture funnel type
  if (formData.funnel_type !== 'email_capture') {
    return null;
  }

  

  return (
    <div className="sticky top-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Landing Page Preview</h2>
        <div 
          className="bg-black text-white rounded-lg overflow-hidden relative"
          style={{
            backgroundColor: formData.landing_page_background_color || '#000000',
            backgroundImage: formData.landing_page_background_image_url ? `url("${formData.landing_page_background_image_url}")` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {formData.landing_page_background_image_url && (
            <div 
              className="absolute inset-0 bg-black rounded-lg"
              style={{ 
                opacity: (formData.landing_page_background_overlay_opacity || 60) / 100 
              }}
            ></div>
          )}
          
          <div className="relative z-10 p-8 text-center min-h-[400px] flex flex-col justify-center">
            <div className="mb-6">
              {formData.landing_page_logo_url ? (
                <div className="flex justify-center mb-4">
                  <img 
                    src={formData.landing_page_logo_url} 
                    alt="Logo" 
                    className={`w-auto object-contain ${
                      formData.landing_page_logo_size === 'small' ? 'h-12 max-w-24' :
                      formData.landing_page_logo_size === 'large' ? 'h-20 max-w-40' :
                      'h-16 max-w-32'
                    }`}
                  />
                </div>
              ) : (!formData.landing_page_show_icon ? null :
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DynamicIcon 
                    iconName="Lock" 
                    className="w-6 h-6 text-white" 
                  />
                </div>
              )}
              
              <div 
                className="text-2xl md:text-4xl font-bold mb-4 leading-tight"
                dangerouslySetInnerHTML={{ 
                  __html: formData.landing_page_title_html || formData.landing_page_title || "Free Exclusive Training"
                }}
              />
              
              {(formData.landing_page_subtitle_html || formData.landing_page_subtitle) && (
                <div 
                  className={`text-lg md:text-xl mb-6 ${formData.landing_page_subtitle_html ? '' : 'text-gray-300'}`}
                  dangerouslySetInnerHTML={{ 
                    __html: formData.landing_page_subtitle_html || formData.landing_page_subtitle || ""
                  }}
                />
              )}
              
              {(formData.landing_page_description_html || formData.landing_page_description) && (
                <div 
                  className={`text-base mb-6 max-w-lg mx-auto ${formData.landing_page_description_html ? '' : 'text-gray-400'}`}
                  dangerouslySetInnerHTML={{ 
                    __html: formData.landing_page_description_html || formData.landing_page_description || ""
                  }}
                />
              )}
            </div>

            {/* Email Capture Form Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-3">
                {formData.landing_page_show_icon && !formData.landing_page_logo_url && (
                  <DynamicIcon 
                    iconName={formData.landing_page_form_icon || 'Mail'} 
                    className="w-5 h-5 text-blue-400 mr-2" 
                  />
                )}
                <h3 className="text-lg font-semibold">{formData.landing_page_form_heading || "Enter Your Email to Watch Now"}</h3>
              </div>
              
              <div className="space-y-3">
                {formData.collect_name && (
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-0 text-sm"
                      placeholder="Enter your name"
                      disabled
                    />
                  </div>
                )}
                
                <div>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-0 text-sm"
                    placeholder="Enter your email address"
                    disabled
                  />
                </div>
                
                {formData.collect_phone && (
                  <div>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-0 text-sm"
                      placeholder="Enter your phone number"
                      disabled
                    />
                  </div>
                )}
                
                {formData.collect_instagram && (
                  <div>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg border-0 text-sm"
                      placeholder="Enter your Instagram handle"
                      disabled
                    />
                  </div>
                )}
                
                <button
                  type="button"
                  disabled
                  className={`w-full px-6 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                    formData.landing_page_button_use_gradient 
                      ? `bg-gradient-to-r ${formData.landing_page_button_bg_gradient || 'from-blue-600 to-purple-600'}` 
                      : ''
                  }`}
                  style={!formData.landing_page_button_use_gradient ? {
                    backgroundColor: formData.landing_page_button_bg_color || '#3b82f6',
                    color: formData.landing_page_button_text_color || '#ffffff',
                    opacity: 1
                  } : {
                    color: formData.landing_page_button_text_color || '#ffffff',
                    opacity: 1
                  }}
                >
                  {formData.landing_page_button_text || "Get Instant Access"}
                </button>
              </div>
              
              <p 
                className="text-xs mt-3"
                style={{ 
                  color: (formData as any).landing_page_privacy_text_color || '#9ca3af' 
                }}
              >
                {(formData as any).landing_page_privacy_text || "🔒 We respect your privacy. Your email will not be shared."}
              </p>
            </div>

            {/* Email Service Integration Badge */}
            {formData.email_service_type && (
              <div className="mt-4">
                <div className="inline-flex items-center px-3 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
                  ✓ {formData.email_service_type === 'aweber' ? 'AWeber' :
                       formData.email_service_type === 'mailchimp' ? 'Mailchimp' :
                       formData.email_service_type === 'convertkit' ? 'ConvertKit' :
                       formData.email_service_type === 'activecampaign' ? 'ActiveCampaign' :
                       'Custom Webhook'} Integration
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
