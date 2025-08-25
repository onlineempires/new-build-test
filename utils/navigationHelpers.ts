import { NextRouter } from 'next/router';

export interface NavigationOptions {
  fallbackToWindowLocation?: boolean;
  delay?: number;
  retries?: number;
  onError?: (error: Error, url: string) => void;
  onSuccess?: (url: string) => void;
}

/**
 * Enhanced navigation utility with error handling and fallbacks
 */
export class NavigationHelper {
  private static instance: NavigationHelper;
  private router: NextRouter | null = null;
  private navigationInProgress = false;

  static getInstance(): NavigationHelper {
    if (!NavigationHelper.instance) {
      NavigationHelper.instance = new NavigationHelper();
    }
    return NavigationHelper.instance;
  }

  setRouter(router: NextRouter) {
    this.router = router;
  }

  /**
   * Navigate with comprehensive error handling and fallbacks
   */
  async navigate(
    url: string, 
    options: NavigationOptions = {}
  ): Promise<boolean> {
    const {
      fallbackToWindowLocation = true,
      delay = 0,
      retries = 2,
      onError,
      onSuccess
    } = options;

    // Prevent multiple simultaneous navigations
    if (this.navigationInProgress) {
      console.warn('Navigation already in progress, ignoring request to:', url);
      return false;
    }

    // Add delay if specified
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.navigationInProgress = true;

    try {
      console.log('Starting navigation to:', url);
      
      // Attempt 1: Use Next.js router
      if (this.router) {
        try {
          await this.router.push(url);
          console.log('Router navigation successful to:', url);
          onSuccess?.(url);
          return true;
        } catch (routerError) {
          console.warn('Router navigation failed to', url, ':', routerError);
          
          // Attempt 2: Retry with router (if retries available)
          for (let i = 0; i < retries; i++) {
            console.log(`Retry ${i + 1}/${retries} for router navigation to:`, url);
            try {
              await new Promise(resolve => setTimeout(resolve, 100 * (i + 1))); // Progressive delay
              await this.router.push(url);
              console.log('Router retry successful to:', url);
              onSuccess?.(url);
              return true;
            } catch (retryError) {
              console.warn(`Router retry ${i + 1} failed:`, retryError);
            }
          }
          
          throw routerError;
        }
      }
      
      // Attempt 3: Fallback to window.location
      if (fallbackToWindowLocation) {
        console.log('Falling back to window.location for:', url);
        window.location.href = url;
        onSuccess?.(url);
        return true;
      }
      
      throw new Error('No navigation method available');
      
    } catch (error) {
      console.error('All navigation attempts failed for', url, ':', error);
      onError?.(error as Error, url);
      return false;
    } finally {
      this.navigationInProgress = false;
    }
  }

  /**
   * Check if navigation is currently in progress
   */
  isNavigating(): boolean {
    return this.navigationInProgress;
  }

  /**
   * Force reset navigation state (use with caution)
   */
  resetNavigationState(): void {
    this.navigationInProgress = false;
  }

  /**
   * Validate URL before navigation
   */
  isValidUrl(url: string): boolean {
    try {
      // Check for valid relative or absolute URLs
      if (url.startsWith('/')) {
        return true; // Valid relative URL
      }
      
      const urlObj = new URL(url, window.location.origin);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Preload a route for better performance
   */
  async preload(url: string): Promise<void> {
    if (this.router && this.isValidUrl(url)) {
      try {
        await this.router.prefetch(url);
        console.log('Preloaded route:', url);
      } catch (error) {
        console.warn('Failed to preload route', url, ':', error);
      }
    }
  }
}

// Export singleton instance
export const navigationHelper = NavigationHelper.getInstance();

/**
 * Utility function for quick navigation with error handling
 */
export async function safeNavigate(
  url: string, 
  options: NavigationOptions = {}
): Promise<boolean> {
  return navigationHelper.navigate(url, {
    fallbackToWindowLocation: true,
    retries: 2,
    ...options
  });
}

/**
 * Hook for component-level navigation with automatic cleanup
 */
export function useNavigationHelper(router: NextRouter) {
  // Set the router instance
  navigationHelper.setRouter(router);
  
  return {
    navigate: (url: string, options?: NavigationOptions) => 
      navigationHelper.navigate(url, options),
    preload: (url: string) => navigationHelper.preload(url),
    isNavigating: () => navigationHelper.isNavigating(),
    resetState: () => navigationHelper.resetNavigationState()
  };
}