import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Enhanced User interface matching the specification
export interface User {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  
  // Trial status flags - key for roleTrial logic
  isFreeTrial: boolean;
  isDollarTrial: boolean;
  
  // Premium membership flags
  rolePremiumMonthly: boolean;  // $99 per month
  rolePremiumAnnual: boolean;   // $799 per year
  
  // Progression flags
  pressedNotReadyInBLB: boolean; // "Not Ready Yet" button pressed flag
  
  // Course and lesson completion tracking
  completedCourses: string[];
  completedLessons: string[];
  
  // Entitlements from SKUs
  ownedSKUs: string[];
  purchasedMasterclasses: string[];
}

// Define the new normalized role flags
export interface UserRoleFlags {
  roleTrial: boolean;           // user.isFreeTrial || user.isDollarTrial
  rolePremiumMonthly: boolean;  // $99 per month
  rolePremiumAnnual: boolean;   // $799 per year
  isPremium: boolean;           // rolePremiumMonthly || rolePremiumAnnual
}

// Section access rules based on specification
export interface SectionAccess {
  section1: boolean;  // Start Here - Foundation Training
  section2: boolean;  // Advanced Training (Premium only)
  section3: boolean;  // Masterclass Training (per-purchase)
}

interface UserContextType {
  user: User;
  roleFlags: UserRoleFlags;
  sectionAccess: SectionAccess;
  
  // User management
  updateUser: (updates: Partial<User>) => void;
  setUserRole: (isFreeTrial: boolean, isDollarTrial: boolean, premiumMonthly?: boolean, premiumAnnual?: boolean) => void;
  
  // Progression management
  setPressedNotReadyInBLB: (pressed: boolean) => void;
  markCourseCompleted: (courseId: string) => void;
  markLessonCompleted: (lessonId: string) => void;
  
  // Purchase management
  addPurchasedMasterclass: (masterclassId: string) => void;
  addOwnedSKU: (sku: string) => void;
  
  // Access checking
  canAccessCourse: (courseId: string, section: number) => boolean;
  canAccessLesson: (lessonId: string, courseId: string) => boolean;
  hasPurchasedMasterclass: (masterclassId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Default user state
const defaultUser: User = {
  id: 0,
  name: 'User',
  email: 'user@example.com',
  avatarUrl: '',
  isFreeTrial: true,
  isDollarTrial: false,
  rolePremiumMonthly: false,
  rolePremiumAnnual: false,
  pressedNotReadyInBLB: false,
  completedCourses: [],
  completedLessons: [],
  ownedSKUs: [],
  purchasedMasterclasses: [],
};

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>(defaultUser);

  // Load user data from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...defaultUser, ...parsedUser });
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  // Persist user data to localStorage
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(user));
  }, [user]);

  // Calculate normalized role flags per specification
  const roleFlags: UserRoleFlags = {
    roleTrial: user.isFreeTrial || user.isDollarTrial,
    rolePremiumMonthly: user.rolePremiumMonthly,
    rolePremiumAnnual: user.rolePremiumAnnual,
    isPremium: user.rolePremiumMonthly || user.rolePremiumAnnual,
  };

  // Calculate section access based on role flags
  const sectionAccess: SectionAccess = {
    section1: true, // Everyone can access Section 1
    section2: roleFlags.isPremium, // Only premium users get Section 2
    section3: true, // Everyone can see Section 3 (purchase required)
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const setUserRole = (
    isFreeTrial: boolean, 
    isDollarTrial: boolean, 
    premiumMonthly: boolean = false, 
    premiumAnnual: boolean = false
  ) => {
    updateUser({
      isFreeTrial,
      isDollarTrial,
      rolePremiumMonthly: premiumMonthly,
      rolePremiumAnnual: premiumAnnual,
    });
  };

  const setPressedNotReadyInBLB = (pressed: boolean) => {
    updateUser({ pressedNotReadyInBLB: pressed });
  };

  const markCourseCompleted = (courseId: string) => {
    if (!user.completedCourses.includes(courseId)) {
      updateUser({
        completedCourses: [...user.completedCourses, courseId]
      });
    }
  };

  const markLessonCompleted = (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      updateUser({
        completedLessons: [...user.completedLessons, lessonId]
      });
    }
  };

  const addPurchasedMasterclass = (masterclassId: string) => {
    if (!user.purchasedMasterclasses.includes(masterclassId)) {
      updateUser({
        purchasedMasterclasses: [...user.purchasedMasterclasses, masterclassId]
      });
    }
  };

  const addOwnedSKU = (sku: string) => {
    if (!user.ownedSKUs.includes(sku)) {
      updateUser({
        ownedSKUs: [...user.ownedSKUs, sku]
      });
    }
  };

  // Course access logic per specification
  const canAccessCourse = (courseId: string, section: number): boolean => {
    switch (section) {
      case 1: // Section 1 - Start Here Foundation
        if (courseId === 'business-blueprint') return true; // Always accessible
        if (courseId === 'discovery-process') {
          // Unlocked if BLB completed OR "Not Ready Yet" pressed
          return user.completedCourses.includes('business-blueprint') || user.pressedNotReadyInBLB;
        }
        if (courseId === 'next-steps') {
          // Unlocked if BLB completed OR "Not Ready Yet" pressed  
          return user.completedCourses.includes('business-blueprint') || user.pressedNotReadyInBLB;
        }
        return true;

      case 2: // Section 2 - Advanced Training (Premium only)
        return roleFlags.isPremium;

      case 3: // Section 3 - Masterclass Training
        return hasPurchasedMasterclass(courseId) || isIncludedInSKU(courseId);

      default:
        return false;
    }
  };

  const canAccessLesson = (lessonId: string, courseId: string): boolean => {
    // For now, simplified - lesson access follows course access
    // In full implementation, this would check lesson sequence within course
    return true; // Placeholder - would implement lesson progression here
  };

  const hasPurchasedMasterclass = (masterclassId: string): boolean => {
    return user.purchasedMasterclasses.includes(masterclassId);
  };

  // Check if masterclass is included in owned SKUs
  const isIncludedInSKU = (masterclassId: string): boolean => {
    // This would map SKUs to included masterclasses
    // For now, return false (masterclasses require individual purchase)
    return false;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        roleFlags,
        sectionAccess,
        updateUser,
        setUserRole,
        setPressedNotReadyInBLB,
        markCourseCompleted,
        markLessonCompleted,
        addPurchasedMasterclass,
        addOwnedSKU,
        canAccessCourse,
        canAccessLesson,
        hasPurchasedMasterclass,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}