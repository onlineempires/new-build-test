import { ChevronDown } from 'lucide-react';
import type { CreateMemberFunnel } from '../../types/funnel';

interface FunnelPreviewProps {
  formData: CreateMemberFunnel;
}

export default function FunnelPreview({ formData }: FunnelPreviewProps) {
  // Add safety check for formData
  if (!formData) {
    return (
      <div className="sticky top-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Live Preview</h2>
          <div className="rounded-lg bg-gray-50 p-8 text-center">
            <p className="text-gray-500">Loading preview...</p>
          </div>
        </div>
      </div>
    );
  }

  const renderHtmlContent = (html: string | undefined, fallback: string) => {
    if (html && html.trim()) {
      try {
        return <div dangerouslySetInnerHTML={{ __html: html }} />;
      } catch (error) {
        console.error('Error rendering HTML content:', error);
        return <span>{fallback}</span>;
      }
    }
    return <span>{fallback}</span>;
  };

  return (
    <div className="sticky top-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Live Preview</h2>
        <div
          className={`${formData.background_image_url ? 'bg-gray-50' : 'bg-black'} relative overflow-hidden rounded-lg p-8 text-center`}
          style={{
            backgroundColor: formData.webinar_background_color || '#000000',
            backgroundImage: formData.background_image_url
              ? `url("${formData.background_image_url}")`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {formData.background_image_url && (
            <div
              className="absolute inset-0 rounded-lg bg-black"
              style={{
                opacity: (formData.background_image_overlay_opacity || 60) / 100,
              }}
            ></div>
          )}
          <div className="relative z-10 space-y-6">
            {/* Title */}
            <div>
              <div
                className={`${formData.title_size || 'text-2xl'} preview-title font-bold`}
                style={{ color: formData.title_color || '#ffffff' }}
              >
                {renderHtmlContent(formData.title_html, formData.title || 'Your Funnel Title')}
              </div>

              {/* Subtitle */}
              {(formData.subtitle_html || formData.subtitle) && (
                <div
                  className={`mt-2 ${formData.subtitle_size || 'text-base'} preview-subtitle`}
                  style={
                    formData.subtitle_html ? {} : { color: formData.subtitle_color || '#d1d5db' }
                  }
                >
                  {renderHtmlContent(formData.subtitle_html, formData.subtitle || '')}
                </div>
              )}
            </div>

            {/* Video Player Placeholder */}
            <div
              className="relative w-full overflow-hidden rounded-lg bg-black"
              style={{ aspectRatio: '16/9' }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 text-center text-sm text-white">
                  🎥{' '}
                  {formData.selected_video_type === 'video_1'
                    ? '45 Minute Webinar'
                    : formData.selected_video_type === 'video_2'
                      ? '60 Min - Webinar'
                      : 'Custom Video'}
                </span>
              </div>
              {/* Preview Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white bg-opacity-20">
                  <svg className="ml-1 h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="text-center">
              <ChevronDown
                className="mx-auto h-8 w-8 animate-bounce"
                style={{ color: formData.arrow_color || '#3b82f6' }}
              />
            </div>

            {/* Outro Section */}
            {formData.show_outro_section && (
              <div className="mt-6 border-t border-gray-300">
                <div
                  className="relative overflow-hidden"
                  style={{
                    backgroundColor: formData.outro_background_color || 'transparent',
                    backgroundImage: formData.outro_background_image_url
                      ? `url("${formData.outro_background_image_url}")`
                      : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '400px',
                  }}
                >
                  {formData.outro_background_image_url && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor:
                          'rgba(0, 0, 0, ' +
                          (formData.outro_background_overlay_opacity || 60) / 100 +
                          ')',
                      }}
                    ></div>
                  )}
                  <div className="relative z-10 space-y-6 p-8">
                    {(formData.outro_text_html || formData.outro_text) && (
                      <div
                        className={`preview-outro ${formData.outro_text_size || 'text-xl'} text-center`}
                        style={{
                          color: formData.outro_text_color || '#d1d5db',
                          fontSize:
                            formData.outro_text_size === 'text-sm'
                              ? '0.875rem'
                              : formData.outro_text_size === 'text-base'
                                ? '1rem'
                                : formData.outro_text_size === 'text-lg'
                                  ? '1.125rem'
                                  : formData.outro_text_size === 'text-xl'
                                    ? '1.25rem'
                                    : formData.outro_text_size === 'text-2xl'
                                      ? '1.5rem'
                                      : formData.outro_text_size === 'text-3xl'
                                        ? '1.875rem'
                                        : '1.25rem',
                        }}
                      >
                        {renderHtmlContent(formData.outro_text_html, formData.outro_text || '')}
                      </div>
                    )}
                    <div
                      className="relative w-full overflow-hidden rounded-lg bg-gray-800"
                      style={{ aspectRatio: '16/9' }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm text-white">🎬 Outro Video</span>
                      </div>
                      {/* Preview Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
                          <svg
                            className="ml-0.5 h-4 w-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Arrow after outro video */}
                    <div className="text-center">
                      <ChevronDown
                        className="mx-auto h-8 w-8 animate-bounce"
                        style={{ color: formData.arrow_color || '#3b82f6' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calendly Section */}
            {formData.calendly_link && (
              <div className="rounded-lg border-t border-gray-300 bg-blue-100 p-4">
                <p className="mb-3 text-sm font-medium text-blue-800">
                  📅 Calendly Booking Section (
                  {formData.calendly_display_type === 'button'
                    ? 'Button Only'
                    : formData.calendly_display_type === 'embed'
                      ? 'Embedded Only'
                      : 'Button + Embedded'}
                  )
                </p>
                {(formData.calendly_display_type === 'button' ||
                  formData.calendly_display_type === 'both' ||
                  !formData.calendly_display_type) && (
                  <button
                    className={`inline-flex items-center space-x-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200 ${
                      formData.calendly_button_use_gradient
                        ? `bg-gradient-to-r ${formData.calendly_button_bg_gradient || 'from-blue-600 to-purple-600'}`
                        : ''
                    }`}
                    style={
                      !formData.calendly_button_use_gradient
                        ? {
                            backgroundColor: formData.calendly_button_bg_color || '#3b82f6',
                            color: formData.calendly_button_text_color || '#ffffff',
                          }
                        : {
                            color: formData.calendly_button_text_color || '#ffffff',
                          }
                    }
                  >
                    <span>📅</span>
                    <span>Schedule Your Call Now</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Title preview with heading support */
        .preview-title h1 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 3.75rem !important; /* text-6xl equivalent */
          line-height: 1 !important;
        }
        .preview-title h2 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 3rem !important; /* text-5xl equivalent */
          line-height: 1 !important;
        }
        .preview-title h3 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 2.25rem !important; /* text-4xl equivalent */
          line-height: 1.1 !important;
        }
        .preview-title h4 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.875rem !important; /* text-3xl equivalent */
          line-height: 1.1 !important;
        }
        .preview-title h5 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.5rem !important; /* text-2xl equivalent */
          line-height: 1.2 !important;
        }
        .preview-title h6 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.25rem !important; /* text-xl equivalent */
          line-height: 1.2 !important;
        }
        .preview-title p {
          margin: 0 !important;
          font-weight: bold !important;
        }
        
        /* Subtitle preview */
        .preview-subtitle h1,
        .preview-subtitle h2,
        .preview-subtitle h3,
        .preview-subtitle h4,
        .preview-subtitle h5,
        .preview-subtitle h6 {
          margin: 0 !important;
          font-weight: 600 !important;
        }
        .preview-subtitle p {
          margin: 0 !important;
        }
        
        /* Allow WYSIWYG colors to show through */
        .preview-subtitle * {
          color: inherit;
        }
        
        /* Outro preview */
        .preview-outro p {
          margin: 0.5rem 0 !important;
        }
        .preview-outro h1,
        .preview-outro h2,
        .preview-outro h3,
        .preview-outro h4,
        .preview-outro h5,
        .preview-outro h6 {
          margin: 0.5rem 0 !important;
          font-weight: 600 !important;
        }
        .preview-outro strong {
          font-weight: 600 !important;
        }
        .preview-outro em {
          font-style: italic !important;
        }
        
        /* Ensure heading colors inherit from parent only when no custom color is set */
        .preview-title h1,
        .preview-title h2,
        .preview-title h3,
        .preview-title h4,
        .preview-title h5,
        .preview-title h6,
        .preview-subtitle h1,
        .preview-subtitle h2,
        .preview-subtitle h3,
        .preview-subtitle h4,
        .preview-subtitle h5,
        .preview-subtitle h6 {
          color: inherit !important;
        }
        
        /* Allow outro content to use custom colors from WYSIWYG editor */
        .preview-outro h1,
        .preview-outro h2,
        .preview-outro h3,
        .preview-outro h4,
        .preview-outro h5,
        .preview-outro h6,
        .preview-outro p,
        .preview-outro span,
        .preview-outro strong,
        .preview-outro em {
          /* Don't force inheritance - let custom colors show through */
        }
        
        /* Fallback for text without heading tags */
        .preview-title {
          line-height: inherit;
        }
        .preview-subtitle {
          line-height: inherit;
        }
      `}</style>
    </div>
  );
}
