import type { CreateMemberFunnel } from '@/types/funnel';
import { DynamicIcon } from '@/utils/iconMapping';

interface LandingPagePreviewProps {
  formData: CreateMemberFunnel;
}

export default function LandingPagePreview({ formData }: LandingPagePreviewProps) {
  // Add safety check for formData
  if (!formData) {
    return (
      <div className="sticky top-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Landing Page Preview</h2>
          <div className="rounded-lg bg-gray-50 p-8 text-center">
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
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Landing Page Preview</h2>
        <div
          className="relative overflow-hidden rounded-lg bg-black text-white"
          style={{
            backgroundColor: formData.landing_page_background_color || '#000000',
            backgroundImage: formData.landing_page_background_image_url
              ? `url("${formData.landing_page_background_image_url}")`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {formData.landing_page_background_image_url && (
            <div
              className="absolute inset-0 rounded-lg bg-black"
              style={{
                opacity: (formData.landing_page_background_overlay_opacity || 60) / 100,
              }}
            ></div>
          )}

          <div className="relative z-10 flex min-h-[400px] flex-col justify-center p-8 text-center">
            <div className="mb-6">
              {formData.landing_page_logo_url ? (
                <div className="mb-4 flex justify-center">
                  <img
                    src={formData.landing_page_logo_url}
                    alt="Logo"
                    className={`w-auto object-contain ${
                      formData.landing_page_logo_size === 'small'
                        ? 'h-12 max-w-24'
                        : formData.landing_page_logo_size === 'large'
                          ? 'h-20 max-w-40'
                          : 'h-16 max-w-32'
                    }`}
                  />
                </div>
              ) : !formData.landing_page_show_icon ? null : (
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <DynamicIcon iconName="Lock" className="h-6 w-6 text-white" />
                </div>
              )}

              <div
                className="mb-4 text-2xl font-bold leading-tight md:text-4xl"
                dangerouslySetInnerHTML={{
                  __html:
                    formData.landing_page_title_html ||
                    formData.landing_page_title ||
                    'Free Exclusive Training',
                }}
              />

              {(formData.landing_page_subtitle_html || formData.landing_page_subtitle) && (
                <div
                  className={`mb-6 text-lg md:text-xl ${formData.landing_page_subtitle_html ? '' : 'text-gray-300'}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.landing_page_subtitle_html || formData.landing_page_subtitle || '',
                  }}
                />
              )}

              {(formData.landing_page_description_html || formData.landing_page_description) && (
                <div
                  className={`mx-auto mb-6 max-w-lg text-base ${formData.landing_page_description_html ? '' : 'text-gray-400'}`}
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.landing_page_description_html ||
                      formData.landing_page_description ||
                      '',
                  }}
                />
              )}
            </div>

            {/* Email Capture Form Preview */}
            <div className="mx-auto max-w-md rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-center">
                {formData.landing_page_show_icon && !formData.landing_page_logo_url && (
                  <DynamicIcon
                    iconName={formData.landing_page_form_icon || 'Mail'}
                    className="mr-2 h-5 w-5 text-blue-400"
                  />
                )}
                <h3 className="text-lg font-semibold">
                  {formData.landing_page_form_heading || 'Enter Your Email to Watch Now'}
                </h3>
              </div>

              <div className="space-y-3">
                {formData.collect_name && (
                  <div>
                    <input
                      type="text"
                      className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900"
                      placeholder="Enter your name"
                      disabled
                    />
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900"
                    placeholder="Enter your email address"
                    disabled
                  />
                </div>

                {formData.collect_phone && (
                  <div>
                    <input
                      type="tel"
                      className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900"
                      placeholder="Enter your phone number"
                      disabled
                    />
                  </div>
                )}

                {formData.collect_instagram && (
                  <div>
                    <input
                      type="text"
                      className="w-full rounded-lg border-0 bg-white px-4 py-3 text-sm text-gray-900"
                      placeholder="Enter your Instagram handle"
                      disabled
                    />
                  </div>
                )}

                <button
                  type="button"
                  disabled
                  className={`w-full rounded-lg px-6 py-3 text-base font-semibold transition-all duration-200 ${
                    formData.landing_page_button_use_gradient
                      ? `bg-gradient-to-r ${formData.landing_page_button_bg_gradient || 'from-blue-600 to-purple-600'}`
                      : ''
                  }`}
                  style={
                    !formData.landing_page_button_use_gradient
                      ? {
                          backgroundColor: formData.landing_page_button_bg_color || '#3b82f6',
                          color: formData.landing_page_button_text_color || '#ffffff',
                          opacity: 1,
                        }
                      : {
                          color: formData.landing_page_button_text_color || '#ffffff',
                          opacity: 1,
                        }
                  }
                >
                  {formData.landing_page_button_text || 'Get Instant Access'}
                </button>
              </div>

              <p
                className="mt-3 text-xs"
                style={{
                  color: (formData as any).landing_page_privacy_text_color || '#9ca3af',
                }}
              >
                {(formData as any).landing_page_privacy_text ||
                  '🔒 We respect your privacy. Your email will not be shared.'}
              </p>
            </div>

            {/* Email Service Integration Badge */}
            {formData.email_service_type && (
              <div className="mt-4">
                <div className="inline-flex items-center rounded-full bg-green-600/20 px-3 py-1 text-xs text-green-400">
                  ✓{' '}
                  {formData.email_service_type === 'aweber'
                    ? 'AWeber'
                    : formData.email_service_type === 'mailchimp'
                      ? 'Mailchimp'
                      : formData.email_service_type === 'convertkit'
                        ? 'ConvertKit'
                        : formData.email_service_type === 'activecampaign'
                          ? 'ActiveCampaign'
                          : 'Custom Webhook'}{' '}
                  Integration
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
