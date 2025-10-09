import { ChevronDown } from 'lucide-react';
import type { CreateFunnelTemplate } from '../../types/funnel';

interface TemplatePreviewProps {
  formData: CreateFunnelTemplate;
}

export default function TemplatePreview({ formData }: TemplatePreviewProps) {
  // Add safety check for formData
  if (!formData) {
    return (
      <div className="sticky top-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Template Preview</h2>
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
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Template Preview</h2>
        <div
          className={`${formData.default_background_image_url ? 'bg-gray-50' : 'bg-black'} relative overflow-hidden rounded-lg p-8 text-center`}
          style={{
            backgroundImage: formData.default_background_image_url
              ? `url("${formData.default_background_image_url}")`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {formData.default_background_image_url && (
            <div className="absolute inset-0 rounded-lg bg-black bg-opacity-60"></div>
          )}
          <div className="relative z-10 space-y-6">
            {/* Title */}
            <div>
              <div
                className={`${formData.default_title_size || 'text-4xl'} preview-template-title font-bold`}
                style={{ color: formData.default_title_color || '#ffffff' }}
              >
                {renderHtmlContent(
                  formData.default_title_html,
                  formData.default_title || 'Your Template Title'
                )}
              </div>

              {/* Subtitle */}
              {(formData.default_subtitle_html || formData.default_subtitle) && (
                <div
                  className={`mt-2 ${formData.default_subtitle_size || 'text-xl'} preview-template-subtitle`}
                  style={{ color: formData.default_subtitle_color || '#d1d5db' }}
                >
                  {renderHtmlContent(
                    formData.default_subtitle_html,
                    formData.default_subtitle || ''
                  )}
                </div>
              )}
            </div>

            {/* Video Player Placeholder */}
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="px-4 text-center text-sm text-white">
                  🎥{' '}
                  {formData.default_video_1_url && formData.default_video_2_url
                    ? 'Default Videos Available'
                    : formData.default_video_1_url
                      ? '45 Minute Webinar'
                      : formData.default_video_2_url
                        ? '60 Min Webinar'
                        : 'No Default Video'}
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
                style={{ color: formData.default_arrow_color || '#3b82f6' }}
              />
            </div>

            {/* Outro Section */}
            {formData.default_show_outro_section && (
              <div className="space-y-4 border-t border-gray-300 pt-6">
                {formData.default_outro_text && (
                  <div
                    className={`preview-template-outro ${formData.default_outro_text_size || 'text-xl'}`}
                    style={{
                      color: formData.default_outro_text_color || '#d1d5db',
                      fontSize:
                        formData.default_outro_text_size === 'text-sm'
                          ? '0.875rem'
                          : formData.default_outro_text_size === 'text-base'
                            ? '1rem'
                            : formData.default_outro_text_size === 'text-lg'
                              ? '1.125rem'
                              : formData.default_outro_text_size === 'text-xl'
                                ? '1.25rem'
                                : formData.default_outro_text_size === 'text-2xl'
                                  ? '1.5rem'
                                  : formData.default_outro_text_size === 'text-3xl'
                                    ? '1.875rem'
                                    : '1.25rem',
                    }}
                  >
                    {renderHtmlContent(
                      formData.default_outro_text,
                      formData.default_outro_text || ''
                    )}
                  </div>
                )}

                <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gray-800">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-white">
                      🎬{' '}
                      {formData.default_outro_video_url
                        ? 'Default Outro Video'
                        : 'No Default Outro Video'}
                    </span>
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
                <div className="mt-4 text-center">
                  <ChevronDown
                    className="mx-auto h-8 w-8 animate-bounce"
                    style={{ color: formData.default_arrow_color || '#3b82f6' }}
                  />
                </div>
              </div>
            )}

            {/* Calendly Section */}
            {formData.default_calendly_link && (
              <div className="rounded-lg border-t border-gray-300 bg-blue-100 p-4">
                <p className="text-sm font-medium text-blue-800">
                  📅 Default Calendly Booking Section
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        /* Template title preview with heading support */
        .preview-template-title h1 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 3.75rem !important; /* text-6xl equivalent */
          line-height: 1 !important;
          color: inherit !important;
        }
        .preview-template-title h2 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 3rem !important; /* text-5xl equivalent */
          line-height: 1 !important;
          color: inherit !important;
        }
        .preview-template-title h3 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 2.25rem !important; /* text-4xl equivalent */
          line-height: 1.1 !important;
          color: inherit !important;
        }
        .preview-template-title h4 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.875rem !important; /* text-3xl equivalent */
          line-height: 1.1 !important;
          color: inherit !important;
        }
        .preview-template-title h5 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.5rem !important; /* text-2xl equivalent */
          line-height: 1.2 !important;
          color: inherit !important;
        }
        .preview-template-title h6 {
          margin: 0 !important;
          font-weight: bold !important;
          font-size: 1.25rem !important; /* text-xl equivalent */
          line-height: 1.2 !important;
          color: inherit !important;
        }
        .preview-template-title p {
          margin: 0 !important;
          font-weight: bold !important;
          color: inherit !important;
        }
        
        /* Template subtitle preview */
        .preview-template-subtitle h1,
        .preview-template-subtitle h2,
        .preview-template-subtitle h3,
        .preview-template-subtitle h4,
        .preview-template-subtitle h5,
        .preview-template-subtitle h6 {
          margin: 0 !important;
          font-weight: 600 !important;
          color: inherit !important;
        }
        .preview-template-subtitle p {
          margin: 0 !important;
          color: inherit !important;
        }
        
        /* Template outro text preview */
        .preview-template-outro p {
          margin: 0.5rem 0 !important;
          color: inherit !important;
        }
        .preview-template-outro h1,
        .preview-template-outro h2,
        .preview-template-outro h3,
        .preview-template-outro h4,
        .preview-template-outro h5,
        .preview-template-outro h6 {
          margin: 0.5rem 0 !important;
          font-weight: 600 !important;
          color: inherit !important;
        }
        .preview-template-outro strong {
          font-weight: 600 !important;
        }
        .preview-template-outro em {
          font-style: italic !important;
        }
      `}</style>
    </div>
  );
}
