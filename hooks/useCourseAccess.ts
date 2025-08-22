import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserRole } from '../contexts/UserRoleContext';
import { useCourseAccess as useCourseAccessContext } from '../contexts/CourseAccessContext';
import { queryKeys } from '../lib/queryClient';
import { useCallback } from 'react';

interface CourseAccess {
  courseId: string;
  hasAccess: boolean;
  purchaseDate?: string;
  expiresAt?: string;
}

interface PurchaseData {
  courseId: string;
  purchaseId: string;
  purchaseDate: string;
  price: number;
  affiliateCommission: number;
}

/**
 * Enhanced course access hook with React Query caching
 */
export function useCourseAccess() {
  const queryClient = useQueryClient();
  const { currentRole, permissions } = useUserRole();
  const { canAccessCourse, getCourseUpgradeMessage, getRestrictedMessage } = useCourseAccessContext();
  
  // Ensure permissions is always defined with safe defaults
  const safePermissions = permissions || {
    canAccessIntroVideos: false,
    canAccessAllCourses: false,
    canAccessStartHereOnly: false,
    canAccessMasterclasses: false,
    canAccessAffiliate: false,
    canAccessExpertDirectory: false,
    canAccessDMO: false,
    canAccessStats: false,
    canAccessLeads: false,
    canUpgradeToMonthly: false,
    canUpgradeToAnnual: false,
    canDowngrade: false,
    isAdmin: false,
    canManageUsers: false,
    canManageCourses: false,
    canViewPayments: false,
    canCreateFunnels: false,
    canManageCalendar: false,
  };

  // Query for purchased courses with caching
  const { data: purchasedCourses = [], isLoading, refetch: refreshPurchases } = useQuery({
    queryKey: queryKeys.courses.access('current-user'),
    queryFn: async () => {
      // First check localStorage for offline support
      const localPurchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
      
      // In production, also fetch from API
      if (process.env.NODE_ENV === 'production') {
        try {
          const response = await fetch('/api/courses/purchases');
          if (response.ok) {
            const data = await response.json();
            // Merge local and remote purchases
            const merged = [...new Set([...localPurchases, ...data])];
            localStorage.setItem('purchasedCourses', JSON.stringify(merged));
            return merged.map((p: any) => p.courseId);
          }
        } catch (error) {
          console.error('Failed to fetch purchases from API:', error);
        }
      }
      
      return localPurchases.map((p: any) => p.courseId);
    },
    staleTime: 60 * 1000, // Cache for 1 minute
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });

  // Mutation for purchasing courses
  const purchaseCourseMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const newPurchase: PurchaseData = {
        courseId,
        purchaseId: `purchase_${Date.now()}`,
        purchaseDate: new Date().toISOString(),
        price: courseId === 'email-marketing-secrets' ? 49 : 99,
        affiliateCommission: (courseId === 'email-marketing-secrets' ? 49 : 99) * 0.25
      };
      
      // Update localStorage
      const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
      const exists = purchases.find((p: any) => p.courseId === courseId);
      
      if (!exists) {
        purchases.push(newPurchase);
        localStorage.setItem('purchasedCourses', JSON.stringify(purchases));
        
        // In production, also update via API
        if (process.env.NODE_ENV === 'production') {
          const response = await fetch('/api/courses/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPurchase),
          });
          
          if (!response.ok) {
            throw new Error('Failed to record purchase');
          }
        }
      }
      
      return courseId;
    },
    onSuccess: (courseId) => {
      // Invalidate and refetch course access data
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.access('current-user') });
      
      // Optimistically update the cache
      queryClient.setQueryData(
        queryKeys.courses.access('current-user'),
        (old: string[] = []) => [...old, courseId]
      );
    },
    onError: (error) => {
      console.error('Purchase failed:', error);
    },
  });

  // Check if a course is purchased
  const isPurchased = useCallback((courseId: string): boolean => {
    // Use the centralized course access system first
    if (canAccessCourse(courseId)) {
      return true;
    }
    
    // Then check purchased courses
    return purchasedCourses.includes(courseId);
  }, [purchasedCourses, canAccessCourse]);

  // Purchase a course
  const purchaseCourse = useCallback((courseId: string) => {
    if (!isPurchased(courseId)) {
      purchaseCourseMutation.mutate(courseId);
    }
  }, [isPurchased, purchaseCourseMutation]);

  // Check course access with role-based permissions
  const checkAccess = useCallback((courseId: string): CourseAccess => {
    const hasAccess = isPurchased(courseId);
    const purchase = JSON.parse(localStorage.getItem('purchasedCourses') || '[]')
      .find((p: any) => p.courseId === courseId);
    
    return {
      courseId,
      hasAccess,
      purchaseDate: purchase?.purchaseDate,
      expiresAt: purchase?.expiresAt,
    };
  }, [isPurchased]);

  return {
    isPurchased,
    purchaseCourse,
    refreshPurchases,
    purchasedCourses,
    currentRole,
    isLoading,
    permissions: {
      ...safePermissions,
      // Affiliate system permissions with safe access
      canAccessAffiliate: currentRole === 'admin' || currentRole === 'downsell' || safePermissions?.canAccessAffiliate || false,
      canManageFunnels: currentRole === 'admin' || safePermissions?.canCreateFunnels || false,
      canViewStats: currentRole === 'admin' || currentRole === 'downsell' || safePermissions?.canAccessStats || false,
    },
    // New methods from CourseAccessContext
    canAccessCourse,
    getCourseUpgradeMessage,
    getRestrictedMessage,
    checkAccess,
  };
}