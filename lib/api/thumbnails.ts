import { LibraryItem } from '../../types/library';

// 6 preset gradient palettes for variety
const GRADIENT_PALETTES = [
  {
    name: 'cosmic',
    from: '#667eea',
    to: '#764ba2',
    accent: '#9f7aea'
  },
  {
    name: 'sunset',
    from: '#f093fb',
    to: '#f5576c',
    accent: '#ff6b9d'
  },
  {
    name: 'ocean',
    from: '#4facfe',
    to: '#00f2fe',
    accent: '#00d4ff'
  },
  {
    name: 'forest',
    from: '#43e97b',
    to: '#38f9d7',
    accent: '#4ade80'
  },
  {
    name: 'volcanic',
    from: '#fa709a',
    to: '#fee140',
    accent: '#fbbf24'
  },
  {
    name: 'midnight',
    from: '#2d1b69',
    to: '#11998e',
    accent: '#06b6d4'
  }
];

// Hash function to get consistent palette for a slug
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Get type badge text and color
function getTypeBadge(type: string): { text: string; color: string } {
  switch (type) {
    case 'course':
      return { text: 'DE+', color: '#3b82f6' };
    case 'masterclass':
      return { text: 'MC+', color: '#8b5cf6' };
    case 'replay':
      return { text: 'CR+', color: '#10b981' };
    default:
      return { text: 'DE+', color: '#3b82f6' };
  }
}

// Format duration for display
function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

// Generate SVG thumbnail with realistic branding
function generateThumbnailSVG(item: LibraryItem): string {
  const palette = GRADIENT_PALETTES[hashString(item.slug) % GRADIENT_PALETTES.length];
  const badge = getTypeBadge(item.type);
  const duration = formatDuration(item.durationMin);
  const primaryTag = item.tags[0] || 'Training';
  
  // Create realistic title wrapping (max 2 lines)
  const words = item.title.split(' ');
  let line1 = '';
  let line2 = '';
  let currentLine = 1;
  
  for (const word of words) {
    if (currentLine === 1) {
      if ((line1 + word).length > 20) {
        currentLine = 2;
        line2 = word;
      } else {
        line1 += (line1 ? ' ' : '') + word;
      }
    } else {
      if ((line2 + ' ' + word).length > 24) {
        line2 += '...';
        break;
      } else {
        line2 += ' ' + word;
      }
    }
  }

  return `<svg width="800" height="450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Main gradient -->
      <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${palette.from};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${palette.to};stop-opacity:1" />
      </linearGradient>
      
      <!-- Vignette overlay -->
      <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
        <stop offset="0%" style="stop-color:rgba(0,0,0,0);stop-opacity:0" />
        <stop offset="100%" style="stop-color:rgba(0,0,0,0.4);stop-opacity:1" />
      </radialGradient>
      
      <!-- Noise pattern -->
      <filter id="noise">
        <feTurbulence baseFrequency="0.9" numOctaves="1" result="noise"/>
        <feColorMatrix type="saturate" values="0" result="monoNoise"/>
        <feComponentTransfer in="monoNoise" result="alphaOutput">
          <feFuncA type="discrete" tableValues="0 .05"/>
        </feComponentTransfer>
        <feComposite in="alphaOutput" in2="SourceGraphic" operator="over"/>
      </filter>
    </defs>
    
    <!-- Background gradient -->
    <rect width="800" height="450" fill="url(#mainGrad)"/>
    
    <!-- Subtle noise texture -->
    <rect width="800" height="450" fill="white" opacity="0.03" filter="url(#noise)"/>
    
    <!-- Vignette -->
    <rect width="800" height="450" fill="url(#vignette)"/>
    
    <!-- Top-left type badge -->
    <rect x="24" y="24" width="60" height="28" rx="14" fill="${badge.color}" opacity="0.9"/>
    <text x="54" y="42" text-anchor="middle" fill="white" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="700">${badge.text}</text>
    
    <!-- Title (bold, centered) -->
    <text x="400" y="200" text-anchor="middle" fill="white" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="800" opacity="0.95">
      ${line1}
    </text>
    ${line2 ? `<text x="400" y="250" text-anchor="middle" fill="white" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="800" opacity="0.95">${line2}</text>` : ''}
    
    <!-- Bottom chips -->
    <g transform="translate(400, 370)">
      <!-- Primary tag chip -->
      <rect x="-80" y="-14" width="70" height="28" rx="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
      <text x="-45" y="4" text-anchor="middle" fill="white" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" opacity="0.9">${primaryTag}</text>
      
      <!-- Duration chip -->
      <rect x="10" y="-14" width="70" height="28" rx="14" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
      <text x="45" y="4" text-anchor="middle" fill="white" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" opacity="0.9">${duration}</text>
    </g>
    
    <!-- Subtle highlight overlay -->
    <rect width="800" height="450" fill="url(#mainGrad)" opacity="0.1"/>
  </svg>`;
}

// Check if original thumbnail exists
export function getOriginalThumbnailPath(slug: string): string | null {
  const extensions = ['jpg', 'jpeg', 'png', 'webp'];
  
  for (const ext of extensions) {
    const path = `/library/thumbnails/${slug}.${ext}`;
    try {
      // In browser environment, we can't check file existence directly
      // This would be handled server-side in a real implementation
      return path;
    } catch {
      continue;
    }
  }
  
  return null;
}

// Generate thumbnail and return public URL
export async function generateThumbnail(item: LibraryItem): Promise<string> {
  try {
    // First check if original exists
    const originalPath = getOriginalThumbnailPath(item.slug);
    if (originalPath) {
      return originalPath;
    }

    // Generate SVG content
    const svgContent = generateThumbnailSVG(item);
    const generatedPath = `/library/thumbnails/generated/${item.slug}.svg`;
    
    // In a real implementation, this would save to filesystem
    // For now, we'll return a data URL for immediate use
    const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;
    
    // Emit event for logging/analytics
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('library_thumb_generated', {
        detail: { slug: item.slug, path: generatedPath }
      }));
    }
    
    return dataUrl;
  } catch (error) {
    console.error('Failed to generate thumbnail for', item.slug, error);
    return item.heroImage || '/library/thumbnails/fallback.svg';
  }
}

// Pre-generate thumbnails for seed items
export async function preGenerateThumbnails(items: LibraryItem[]): Promise<Map<string, string>> {
  const thumbnailMap = new Map<string, string>();
  
  const generatePromises = items.map(async (item) => {
    const thumbnailUrl = await generateThumbnail(item);
    thumbnailMap.set(item.slug, thumbnailUrl);
    return { slug: item.slug, url: thumbnailUrl };
  });
  
  await Promise.all(generatePromises);
  
  console.log(`Pre-generated ${thumbnailMap.size} thumbnails for library items`);
  return thumbnailMap;
}

// Utility to get thumbnail URL with fallback
export function getThumbnailUrl(item: LibraryItem, pregenerated?: Map<string, string>): string {
  // Check pregenerated cache first
  if (pregenerated?.has(item.slug)) {
    return pregenerated.get(item.slug)!;
  }
  
  // Check if original exists (simplified check)
  if (item.heroImage && !item.heroImage.includes('data:image/svg+xml')) {
    return item.heroImage;
  }
  
  // Generate on-demand
  return generateThumbnail(item).then(url => url).catch(() => item.heroImage || '/library/thumbnails/fallback.svg') as any;
}