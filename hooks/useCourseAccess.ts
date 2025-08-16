import { useState, useEffect } from 'react';
import { useUserRole } from '../contexts/UserRoleContext';

export function useCourseAccess() {
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const { currentRole, permissions } = useUserRole();

  useEffect(() => {
    // Check purchased individual courses
    const purchases = JSON.parse(localStorage.getItem('purchasedCourses') || '[]');
    const courseIds = purchases.map((p: any) => p.courseId);
    setPurchasedCourses(courseIds);
  }, []);

  const isPurchased = (courseId: string) => {
    // Special masterclasses require individual purchase regardless of plan
    const paidMasterclasses = ['email-marketing-secrets', 'advanced-funnel-mastery'];
    if (paidMasterclasses.includes(courseId)) {
      return purchasedCourses.includes(courseId);
    }

    // Check if user has access to all courses based on their role
    if (permissions.canAccessAllCourses) {
      return true;
    }

    // Check if it's an intro video course for limited access roles
    const introCourses = ['business-blueprint', 'discovery-process', 'next-steps'];
    if (introCourses.includes(courseId) && permissions.canAccessIntroVideos) {
      return true;
    }

    // Individual purchase access
    return purchasedCourses.includes(courseId);
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
    permissions
  };
}