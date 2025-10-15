import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, Calendar } from 'lucide-react';
import type { MemberFunnel, FunnelTemplate } from '@/types/funnel';
import { DynamicIcon } from '@/utils/iconMapping';
import { publicFunnelApi } from '@/lib/api/funnel';

export default function PublicFunnel() {
  const router = useRouter();
  const { funnel_id } = router.query;
  const [funnel, setFunnel] = useState<MemberFunnel | null>(null);
  const [template, setTemplate] = useState<FunnelTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [emailFromUrl, setEmailFromUrl] = useState<string | null>(null);
  const [showWebinar, setShowWebinar] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get('email');
      const view = searchParams.get('view');
      setEmailFromUrl(email);
      setShowWebinar(view === 'webinar' || !!email);
    }
  }, []);

  useEffect(() => {
    if (funnel_id && typeof funnel_id === 'string') {
      fetchFunnel();
    }
  }, [funnel_id]);

  // Track page visit once when component mounts
  useEffect(() => {
    if (funnel_id && typeof funnel_id === 'string' && !loading && funnel) {
      trackAnalytics('page_visit');
    }
  }, [funnel_id, loading, funnel]);

  // Update SEO meta tags when funnel data is loaded
  useEffect(() => {
    if (funnel) {
      // Update document title
      if (funnel.meta_title) {
        document.title = funnel.meta_title;
      } else if (funnel.title) {
        document.title = funnel.title;
      }

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      if (funnel.meta_description) {
        metaDescription.setAttribute('content', funnel.meta_description);
      } else if (funnel.subtitle) {
        // Strip HTML tags from subtitle for meta description
        const plainSubtitle = funnel.subtitle.replace(/<[^>]*>/g, '');
        metaDescription.setAttribute('content', plainSubtitle);
      }

      // Update Open Graph tags
      const ogTags = [
        { property: 'og:title', content: funnel.meta_title || funnel.title },
        {
          property: 'og:description',
          content: funnel.meta_description || funnel.subtitle?.replace(/<[^>]*>/g, '') || '',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: window.location.href },
      ];

      if (funnel.og_image_url) {
        ogTags.push({ property: 'og:image', content: funnel.og_image_url });
      }

      ogTags.forEach(({ property, content }) => {
        if (content) {
          let metaTag = document.querySelector(`meta[property="${property}"]`);
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', property);
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', content);
        }
      });

      // Twitter Card tags
      const twitterTags = [
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: funnel.meta_title || funnel.title },
        {
          name: 'twitter:description',
          content: funnel.meta_description || funnel.subtitle?.replace(/<[^>]*>/g, '') || '',
        },
      ];

      if (funnel.og_image_url) {
        twitterTags.push({
          name: 'twitter:image',
          content: funnel.og_image_url,
        });
      }

      twitterTags.forEach(({ name, content }) => {
        if (content) {
          let metaTag = document.querySelector(`meta[name="${name}"]`);
          if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', name);
            document.head.appendChild(metaTag);
          }
          metaTag.setAttribute('content', content);
        }
      });
    }
  }, [funnel]);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
      setEmailSubmitted(true);
    }
  }, [emailFromUrl]);

  const fetchFunnel = async () => {
    if (!funnel_id || typeof funnel_id !== 'string') {
      console.error('Invalid funnel_id:', funnel_id);
      setError(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching funnel for slug:', funnel_id);
      const response = await publicFunnelApi.getFunnel(funnel_id);

      setFunnel(response.funnel);
      setTemplate(response.template);
    } catch (error) {
      console.error('Failed to fetch funnel:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const trackAnalytics = async (event: string) => {
    if (!funnel_id || typeof funnel_id !== 'string') return;

    try {
      await publicFunnelApi.trackAnalytics(funnel_id, {
        [event]: true,
      });
    } catch (error) {
      console.error('Failed to track analytics:', error);
    }
  };

  const trackVideoPlay = () => {
    trackAnalytics('video_watched');
  };

  const trackOutroPlay = () => {
    trackAnalytics('outro_watched');
  };

  const trackCalendlyClick = () => {
    trackAnalytics('calendly_clicked');
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    if (!phoneNumber.trim()) return true; // Allow empty if not required

    const cleanPhone = phoneNumber.trim();

    // Remove all non-digit characters for digit validation
    const digitsOnly = cleanPhone.replace(/\D/g, '');

    // Check if it has valid length (7-15 digits)
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return false;
    }

    // Check for invalid patterns (all same digits, sequential numbers, etc.)
    const invalidPatterns = [
      /^(\d)\1+$/, // All same digits (111111111, 222222222, etc.)
      /^(123456789|987654321|012345678|876543210)/, // Sequential patterns
      /^(000|111|222|333|444|555|666|777|888|999)/, // Repeating 3-digit patterns
    ];

    for (const pattern of invalidPatterns) {
      if (pattern.test(digitsOnly)) {
        return false;
      }
    }

    // Check for valid phone number format
    const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)\.]{6,18}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return false;
    }

    // Additional validation: must contain at least 2 different digits
    const uniqueDigits = new Set(digitsOnly);
    if (uniqueDigits.size < 2) {
      return false;
    }

    // Must not be all the same 3-digit group repeated
    const threeDigitGroups = digitsOnly.match(/.{1,3}/g) || [];
    if (threeDigitGroups.length > 2) {
      const firstGroup = threeDigitGroups[0];
      if (firstGroup) {
        const allSameGroup = threeDigitGroups.every(
          (group) => group === firstGroup || group.startsWith(firstGroup)
        );
        if (allSameGroup && firstGroup.length === 3) {
          return false;
        }
      }
    }

    return true;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    if (value.trim()) {
      setPhoneValid(validatePhoneNumber(value));
    } else {
      setPhoneValid(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate required fields
    if (funnel && funnel.collect_name === 1 && !name.trim()) {
      alert('Please enter your name');
      return;
    }

    // Validate phone number if provided
    if (funnel && funnel.collect_phone === 1 && phone.trim() && !validatePhoneNumber(phone)) {
      alert('Please enter a valid phone number');
      return;
    }

    setSubmittingEmail(true);

    try {
      const formData = {
        email,
        ...(funnel && funnel.collect_name === 1 && name.trim() && { name: name.trim() }),
        ...(funnel && funnel.collect_phone === 1 && phone.trim() && { phone: phone.trim() }),
        ...(funnel &&
          funnel.collect_instagram === 1 &&
          instagram.trim() && { instagram: instagram.trim() }),
      };

      await publicFunnelApi.submitEmail(funnel_id as string, formData);

      setEmailSubmitted(true);
      // Update URL to include email parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('email', email);
      newUrl.searchParams.set('view', 'webinar');
      window.history.pushState({}, '', newUrl.toString());
    } catch (error) {
      console.error('Form submission failed:', error);
      alert('Failed to submit information. Please try again.');
    } finally {
      setSubmittingEmail(false);
    }
  };

  const getVideoUrl = () => {
    if (!funnel) return null;

    if (funnel.selected_video_type === 'custom' && funnel.custom_video_url) {
      return funnel.custom_video_url;
    }

    if (template) {
      if (funnel.selected_video_type === 'video_1') {
        return template.default_video_1_url;
      } else if (funnel.selected_video_type === 'video_2') {
        return template.default_video_2_url;
      }
    }

    return null;
  };

  const getVideoEmbedUrl = (url: string, autoplay = false) => {
    if (!url) return url;

    const autoplayParam = autoplay ? '&autoplay=1&muted=1' : '&autoplay=0';

    // Handle Bunny.net URLs (iframe.mediadelivery.net, bunnycdn.com, b-cdn.net)
    if (url.includes('iframe.mediadelivery.net/embed/')) {
      // Already an embed URL
      const separator = url.includes('?') ? '&' : '?';
      return url + (autoplay ? `${separator}autoplay=1&muted=1` : '');
    }

    if (url.includes('bunnycdn.com') || url.includes('b-cdn.net')) {
      // Convert direct Bunny.net URLs to embed format
      const urlParts = url.split('/');
      const videoId = urlParts[urlParts.length - 1]?.split('.')[0]; // Remove file extension
      const libraryId = urlParts[urlParts.length - 2];
      if (videoId && libraryId) {
        const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
        return embedUrl + (autoplay ? '?autoplay=1&muted=1' : '');
      }
    }

    // YouTube URL transformations
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplayParam}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${autoplayParam}`;
    }

    // Vimeo URL transformations - handle both regular and private video formats
    if (url.includes('vimeo.com/')) {
      // Handle private video URLs like https://vimeo.com/1114474519/cd2e9fbf5a
      if (url.includes('/') && url.split('vimeo.com/')[1]?.includes('/')) {
        const parts = url.split('vimeo.com/')[1]?.split('/');
        const videoId = parts?.[0];
        const hash = parts?.[1]?.split('?')[0]; // Remove any query params
        if (videoId && hash) {
          return `https://player.vimeo.com/video/${videoId}?h=${hash}&title=0&byline=0&portrait=0${autoplayParam}`;
        }
      }
      // Handle regular public video URLs like https://vimeo.com/1044226453?share=copy
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0]?.split('/')[0];
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0${autoplayParam}`;
      }
    }

    return url;
  };

  const isEmbedScript = (content: string) => {
    return content.includes('<iframe') || content.includes('<script') || content.includes('<embed');
  };

  const SimpleVideoEmbed = ({
    videoUrl,
    autoplay = false,
    onLoad,
  }: {
    videoUrl: string;
    autoplay?: boolean;
    onLoad?: () => void;
  }) => {
    if (!videoUrl) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-800 text-white">
          <p>No video available</p>
        </div>
      );
    }

    // If it's an embed script (contains HTML tags), render it directly
    if (isEmbedScript(videoUrl)) {
      return <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: videoUrl }} />;
    }

    // Handle direct video file URLs
    if (videoUrl.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i)) {
      return (
        <video
          className="h-full w-full object-cover"
          controls
          autoPlay={autoplay}
          muted={autoplay}
          onPlay={onLoad}
          style={{ objectFit: 'cover' }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    // Handle YouTube, Vimeo, Bunny.net and other iframe URLs
    const embedUrl = getVideoEmbedUrl(videoUrl, autoplay);
    return (
      <iframe
        src={embedUrl}
        className="absolute left-0 top-0 h-full w-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: '0',
          left: '0',
          objectFit: 'cover',
          minWidth: '100%',
          minHeight: '100%',
        }}
      />
    );
  };

  const getOutroVideoUrl = () => {
    if (!funnel || !funnel.show_outro_section) return null;

    if (funnel.outro_video_type === 'custom' && funnel.outro_custom_url) {
      return funnel.outro_custom_url;
    }

    if (template && funnel.outro_video_type === 'option_1') {
      return template.default_outro_video_url;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p>Loading funnel...</p>
        </div>
      </div>
    );
  }

  if (error || !funnel) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h1 className="mb-4 text-2xl font-bold">Funnel Not Found</h1>
          <p className="text-gray-400">
            The funnel you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  // For email capture funnels, show landing page first unless email is submitted
  if (funnel.funnel_type === 'email_capture' && !showWebinar && !emailSubmitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Email Capture Landing Page */}
        <section
          className="relative flex min-h-screen w-full items-center justify-center px-6 py-20"
          style={{
            backgroundColor: funnel.landing_page_background_color || '#000000',
            backgroundImage: funnel.landing_page_background_image_url
              ? `url(${funnel.landing_page_background_image_url})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {funnel.landing_page_background_image_url && (
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: ((funnel as any).landing_page_background_overlay_opacity || 60) / 100,
              }}
            ></div>
          )}
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mb-8">
              {funnel.landing_page_logo_url ? (
                <div className="mb-6 flex justify-center">
                  <img
                    src={funnel.landing_page_logo_url}
                    alt="Logo"
                    className={`w-auto object-contain ${
                      funnel.landing_page_logo_size === 'small'
                        ? 'h-12 max-w-32'
                        : funnel.landing_page_logo_size === 'large'
                          ? 'h-20 max-w-56'
                          : 'h-16 max-w-48'
                    }`}
                  />
                </div>
              ) : (
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                  <DynamicIcon iconName="Lock" className="h-8 w-8 text-white" />
                </div>
              )}

              <div className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
                {funnel.landing_page_title_html ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: funnel.landing_page_title_html,
                    }}
                  />
                ) : (
                  <div>{funnel.landing_page_title || 'Free Exclusive Training'}</div>
                )}
              </div>

              {(funnel.landing_page_subtitle_html || funnel.landing_page_subtitle) && (
                <div className="mb-8 text-xl text-gray-300 md:text-2xl">
                  {funnel.landing_page_subtitle_html ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: funnel.landing_page_subtitle_html,
                      }}
                    />
                  ) : (
                    <div>{funnel.landing_page_subtitle}</div>
                  )}
                </div>
              )}

              {(funnel.landing_page_description_html || funnel.landing_page_description) && (
                <div className="mx-auto mb-8 max-w-xl text-lg text-gray-400">
                  {funnel.landing_page_description_html ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: funnel.landing_page_description_html,
                      }}
                    />
                  ) : (
                    <div>{funnel.landing_page_description}</div>
                  )}
                </div>
              )}
            </div>

            {/* Email Capture Form */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-center">
                {funnel.landing_page_show_icon !== 0 && !funnel.landing_page_logo_url && (
                  <DynamicIcon
                    iconName={funnel.landing_page_form_icon || 'Mail'}
                    className="mr-2 h-6 w-6 text-blue-400"
                  />
                )}
                <h3 className="text-xl font-semibold">
                  {funnel.landing_page_form_heading || 'Enter Your Email to Watch Now'}
                </h3>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {funnel.collect_name === 1 && (
                  <div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border-0 bg-white px-6 py-4 text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                      placeholder="Enter your name"
                      required
                      disabled={submittingEmail}
                    />
                  </div>
                )}

                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border-0 bg-white px-6 py-4 text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    placeholder="Enter your email address"
                    required
                    disabled={submittingEmail}
                  />
                </div>

                {funnel.collect_phone === 1 && (
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className={`w-full rounded-xl border-2 bg-white px-6 py-4 text-lg text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 ${
                        phoneValid === false
                          ? 'border-red-500 focus:ring-red-500/50'
                          : phoneValid === true
                            ? 'border-green-500 focus:ring-green-500/50'
                            : 'border-transparent focus:ring-blue-500/50'
                      }`}
                      placeholder="Enter your phone number (e.g., +1-555-123-4567)"
                      disabled={submittingEmail}
                    />
                    {phoneValid === false && (
                      <p className="mt-2 text-left text-sm text-red-400">
                        Please enter a valid phone number
                      </p>
                    )}
                    {phoneValid === true && (
                      <p className="mt-2 text-left text-sm text-green-400">✓ Valid phone number</p>
                    )}
                  </div>
                )}

                {funnel.collect_instagram === 1 && (
                  <div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      className="w-full rounded-xl border-0 bg-white px-6 py-4 text-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                      placeholder="Enter your Instagram handle"
                      disabled={submittingEmail}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingEmail || !email}
                  className={`w-full transform rounded-xl px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 ${
                    funnel.landing_page_button_use_gradient
                      ? `bg-gradient-to-r ${
                          funnel.landing_page_button_bg_gradient || 'from-blue-600 to-purple-600'
                        } hover:from-blue-700 hover:to-purple-700`
                      : 'hover:opacity-90'
                  }`}
                  style={
                    !funnel.landing_page_button_use_gradient
                      ? {
                          backgroundColor: funnel.landing_page_button_bg_color || '#3b82f6',
                          color: funnel.landing_page_button_text_color || '#ffffff',
                          opacity: 1,
                        }
                      : {
                          color: funnel.landing_page_button_text_color || '#ffffff',
                          opacity: 1,
                        }
                  }
                >
                  {submittingEmail
                    ? 'Getting Your Access...'
                    : funnel.landing_page_button_text || 'Get Instant Access'}
                </button>
              </form>

              <p
                className="mt-4 text-xs"
                style={{
                  color: funnel.landing_page_privacy_text_color || '#9ca3af',
                }}
              >
                {funnel.landing_page_privacy_text ||
                  '🔒 We respect your privacy. Your email will not be shared.'}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const videoUrl = getVideoUrl();
  const outroVideoUrl = getOutroVideoUrl();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        className="relative min-h-screen w-full px-6 py-20"
        style={{
          backgroundColor: funnel.webinar_background_color || '#000000',
          backgroundImage: funnel.background_image_url
            ? `url(${funnel.background_image_url})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {funnel.background_image_url && (
          <div
            className="absolute inset-0 bg-black"
            style={{
              opacity: ((funnel as any).background_image_overlay_opacity || 60) / 100,
            }}
          ></div>
        )}
        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Title and Subtitle */}
          <div className="mb-12">
            <div
              className={`${
                funnel.title_size || 'text-4xl'
              } mb-6 font-bold leading-tight md:text-6xl`}
              style={{ color: funnel.title_color || '#ffffff' }}
              dangerouslySetInnerHTML={{
                __html: funnel.title_html || funnel.title || '',
              }}
            />
            {(funnel.subtitle_html || funnel.subtitle) && (
              <div
                className={`${funnel.subtitle_size || 'text-xl'} mx-auto max-w-3xl md:text-2xl`}
                style={{ color: funnel.subtitle_color || '#d1d5db' }}
                dangerouslySetInnerHTML={{
                  __html: funnel.subtitle_html || funnel.subtitle || '',
                }}
              />
            )}
          </div>

          {/* Main Video */}
          <div className="mb-12">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
              <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {videoUrl ? (
                  <SimpleVideoEmbed
                    videoUrl={videoUrl}
                    autoplay={funnel?.autoplay_video === 1}
                    onLoad={trackVideoPlay}
                  />
                ) : (
                  <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-800 text-white">
                    <p>No video available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Arrow Pointer */}
          <div className="mb-12">
            <div className="flex justify-center">
              <div className="animate-bounce">
                <ChevronDown
                  className="h-12 w-12"
                  style={{ color: funnel.arrow_color || '#3b82f6' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Outro Section */}
      {funnel.show_outro_section && (
        <section
          className="relative px-6 py-12"
          style={{
            backgroundColor: funnel.outro_background_color || undefined,
            backgroundImage: funnel.outro_background_image_url
              ? `url(${funnel.outro_background_image_url})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Default gradient background when no custom background is set */}
          {!funnel.outro_background_color && !funnel.outro_background_image_url && (
            <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
          )}

          {/* Background overlay for custom background image */}
          {funnel.outro_background_image_url && (
            <div
              className="absolute inset-0 bg-black"
              style={{
                opacity: ((funnel as any).outro_background_overlay_opacity || 60) / 100,
              }}
            ></div>
          )}
          <div className="relative z-10 mx-auto max-w-4xl text-center">
            {(funnel.outro_text_html || funnel.outro_text) && (
              <div className="mb-12">
                <div
                  className="outro-content leading-relaxed"
                  style={{
                    color: funnel.outro_text_color || '#d1d5db',
                    fontSize:
                      funnel.outro_text_size === 'text-sm'
                        ? '0.875rem'
                        : funnel.outro_text_size === 'text-base'
                          ? '1rem'
                          : funnel.outro_text_size === 'text-lg'
                            ? '1.125rem'
                            : funnel.outro_text_size === 'text-xl'
                              ? '1.25rem'
                              : funnel.outro_text_size === 'text-2xl'
                                ? '1.5rem'
                                : funnel.outro_text_size === 'text-3xl'
                                  ? '1.875rem'
                                  : '1.25rem',
                  }}
                  dangerouslySetInnerHTML={{
                    __html: funnel.outro_text_html || funnel.outro_text || '',
                  }}
                />
              </div>
            )}

            <div className="mb-12">
              <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {outroVideoUrl ? (
                    <SimpleVideoEmbed
                      videoUrl={outroVideoUrl}
                      autoplay={false}
                      onLoad={trackOutroPlay}
                    />
                  ) : (
                    <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-800 text-white">
                      <p>No outro video available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow Pointer After Outro */}
            <div className="mb-12">
              <div className="flex justify-center">
                <div className="animate-bounce">
                  <ChevronDown
                    className="h-12 w-12"
                    style={{ color: funnel.arrow_color || '#3b82f6' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Calendly Section */}
      {funnel.calendly_link && (
        <section className="bg-gradient-to-b from-gray-900 to-blue-900 px-6 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-12">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Take the Next Step?</h2>
              <p className="mb-8 text-xl text-gray-300">
                Book a free consultation call to get started today
              </p>

              {/* Button (show if type is 'button' or 'both') */}
              {(funnel.calendly_display_type === 'button' ||
                funnel.calendly_display_type === 'both' ||
                !funnel.calendly_display_type) && (
                <a
                  href={funnel.calendly_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={trackCalendlyClick}
                  className={`inline-flex transform items-center space-x-3 rounded-xl px-8 py-4 text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
                    funnel.calendly_button_use_gradient
                      ? `bg-gradient-to-r ${
                          funnel.calendly_button_bg_gradient || 'from-blue-600 to-purple-600'
                        } hover:from-blue-700 hover:to-purple-700`
                      : 'hover:opacity-90'
                  }`}
                  style={
                    !funnel.calendly_button_use_gradient
                      ? {
                          backgroundColor: funnel.calendly_button_bg_color || '#3b82f6',
                          color: funnel.calendly_button_text_color || '#ffffff',
                        }
                      : {
                          color: funnel.calendly_button_text_color || '#ffffff',
                        }
                  }
                >
                  <Calendar className="h-6 w-6" />
                  <span>Schedule Your Call Now</span>
                </a>
              )}
            </div>

            {/* Calendly Embed (show if type is 'embed' or 'both') */}
            {(funnel.calendly_display_type === 'embed' ||
              funnel.calendly_display_type === 'both' ||
              !funnel.calendly_display_type) && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
                <iframe
                  src={
                    funnel.calendly_link.replace('calendly.com/', 'calendly.com/') + '?embed=true'
                  }
                  width="100%"
                  height="600"
                  frameBorder="0"
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black px-6 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-gray-500">© 2024 FunnelFlow. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        /* Allow custom colors from WYSIWYG editor while maintaining default text styles */
        .outro-content p {
          margin: 0.5rem 0;
        }
        .outro-content strong {
          font-weight: 600 !important;
        }
        .outro-content em {
          font-style: italic !important;
        }
        /* Only inherit font-size, but allow custom colors to show through */
        .outro-content * {
          font-size: inherit !important;
        }
      `}</style>
    </div>
  );
}
