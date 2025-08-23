import { useState, useEffect } from 'react';
import { LibraryItem } from '../../types/library';
import { generateThumbnail } from '../../lib/api/thumbnails';

interface LibraryCardProps {
  item: LibraryItem;
  onClick: (item: LibraryItem) => void;
}

export default function LibraryCard({ item, onClick }: LibraryCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string>(item.heroImage);

  // Generate realistic thumbnail if needed
  useEffect(() => {
    const loadThumbnail = async () => {
      try {
        const url = await generateThumbnail(item);
        setThumbnailUrl(url);
      } catch (error) {
        console.error('Failed to generate thumbnail:', error);
        setThumbnailUrl(item.heroImage);
      }
    };

    loadThumbnail();
  }, [item]);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'course': return 'DE+';
      case 'masterclass': return 'MC+';
      case 'replay': return 'CR+';
      default: return 'DE+';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'course': return 'bg-blue-600';
      case 'masterclass': return 'bg-purple-600';
      case 'replay': return 'bg-green-600';
      default: return 'bg-blue-600';
    }
  };

  const handleCardClick = () => {
    onClick(item);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(item);
    }
  };

  return (
    <div
      className="group relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:-translate-y-1 hover:scale-[1.02]"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.title}`}
    >
      {/* Hero Image Container */}
      <div className="relative aspect-video bg-gradient-to-br from-slate-700 to-slate-800 overflow-hidden">
        {/* Loading State */}
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-700 animate-pulse">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Hero Image */}
        {!imageError && (
          <img
            src={thumbnailUrl}
            alt={item.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        )}

        {/* Fallback Gradient */}
        {imageError && (
          <div className="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
            <span className="text-white text-sm font-semibold opacity-60">
              {getTypeLabel(item.type)}
            </span>
          </div>
        )}

        {/* Dark Overlay for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10"></div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-bold text-white ${getTypeColor(item.type)} shadow-lg`}>
            {getTypeLabel(item.type)}
          </span>
        </div>

        {/* Lock Icon for Gated Content */}
        {item.isLocked && (
          <div className="absolute top-3 right-3">
            <div className="w-8 h-8 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <i className="fas fa-lock text-white text-sm"></i>
            </div>
          </div>
        )}

        {/* Progress Ring for Started Content */}
        {!item.isLocked && item.progressPct !== undefined && item.progressPct > 0 && (
          <div className="absolute top-3 right-3">
            <div className="relative w-8 h-8">
              {/* Background Circle */}
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="14"
                  stroke="#22c55e"
                  strokeWidth="3"
                  fill="transparent"
                  strokeDasharray={87.96}
                  strokeDashoffset={87.96 * (1 - item.progressPct / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              {/* Progress Percentage */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {item.progressPct === 100 ? '✓' : `${item.progressPct}%`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hover Gradient Bloom Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/0 via-blue-600/0 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-blue-100 transition-colors">
          {item.title}
        </h3>

        {/* Footer Row */}
        <div className="flex items-center justify-between">
          {/* Duration Badge */}
          <span className="inline-flex items-center px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded-md">
            <i className="fas fa-clock mr-1 text-xs"></i>
            {formatDuration(item.durationMin)}
          </span>

          {/* Action Indicator */}
          <div className="flex items-center space-x-2">
            {item.isLocked ? (
              <span className="text-xs text-orange-400 font-medium">
                Unlock
              </span>
            ) : item.progressPct === 100 ? (
              <span className="text-xs text-green-400 font-medium">
                Completed
              </span>
            ) : item.progressPct && item.progressPct > 0 ? (
              <span className="text-xs text-blue-400 font-medium">
                Continue
              </span>
            ) : (
              <span className="text-xs text-slate-400 font-medium">
                Start
              </span>
            )}
            <i className="fas fa-chevron-right text-xs text-slate-500 group-hover:text-blue-400 transition-colors"></i>
          </div>
        </div>
      </div>

      {/* Ripple Effect for Touch */}
      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-active:opacity-100 transition-opacity duration-150 pointer-events-none"></div>
    </div>
  );
}