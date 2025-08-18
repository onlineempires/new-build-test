import { useState, useEffect } from 'react';
import { useUserRole } from '../contexts/UserRoleContext';
import { useCourseAccess as useCourseAccessContext } from '../contexts/CourseAccessContext';

export function useCourseAccess() {
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const { currentRole, permissions } = useUserRole();
  const { canAccessCourse, getCourseUpgradeMessage, getRestrictedMessage } = useCourseAccessContext();

  useEffect(() => {
    // Check purchased individual courses (mainly for masterclasses)
    const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
    const courseIds = purchases.map((p: any) => p.courseId);
    setPurchasedCourses(courseIds);
  }, []);

  const isPurchased = (courseId: string) => {
    // Use the new centralized course access system
    return canAccessCourse(courseId) || purchasedCourses.includes(courseId);
  };

  const purchaseCourse = (courseId: string) => {
    if (!purchasedCourses.includes(courseId)) {
      const newPurchasedCourses = [...purchasedCourses, courseId];
      setPurchasedCourses(newPurchasedCourses);
      
      // Also ensure localStorage is updated properly
      const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
      const exists = purchases.find((p: any) => p.courseId === courseId);
      if (!exists) {
        const newPurchase = {
          courseId,
          purchaseId: `purchase_${Date.now()}`,
          purchaseDate: new Date().toISOString(),
          price: courseId === 'email-marketing-secrets' ? 49 : 99,
          affiliateCommission: (courseId === 'email-marketing-secrets' ? 49 : 99) * 0.25
        };
        purchases.push(newPurchase);
        localStorage.setItem('purchasedCourses', JSON.stringify(purchases));
      }
    }
  };

  const refreshPurchases = () => {
    const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
    const courseIds = purchases.map((p: any) => p.courseId);
    setPurchasedCourses(courseIds);
  };

  return {
    isPurchased,
    purchaseCourse,
    refreshPurchases,
    purchasedCourses,
    currentRole,
    permissions: {
      ...permissions,
      // Affiliate system permissions
      canAccessAffiliate: currentRole === 'admin' || currentRole === 'affiliate' || permissions.canAccessAffiliate || false,
      canManageFunnels: currentRole === 'admin' || permissions.canManageFunnels || false,
      canViewStats: currentRole === 'admin' || currentRole === 'affiliate' || permissions.canViewStats || false,
    },
    // New methods from CourseAccessContext
    canAccessCourse,
    getCourseUpgradeMessage,
    getRestrictedMessage
  };
}