import { IronSessionOptions } from 'iron-session';
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';
import { NextApiHandler } from 'next';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

// Session configuration
export const sessionOptions: IronSessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long_for_production',
  cookieName: 'admin_session',
  ttl: 60 * 60 * 24, // 24 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 - 60, // Expire cookie 1 minute before session
    path: '/',
  },
};

// User session type
export interface UserSession {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userId?: string;
  email?: string;
  role?: string;
  loginTime?: number;
  lastActivity?: number;
}

// Declare module for iron-session
declare module 'iron-session' {
  interface IronSessionData {
    user?: UserSession;
  }
}

// Wrapper for API routes
export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Wrapper for SSR pages
export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

// Session validation helper
export function validateSession(session?: UserSession): boolean {
  if (!session || !session.isLoggedIn) {
    return false;
  }
  
  // Check if session is expired (24 hours)
  if (session.loginTime) {
    const currentTime = Date.now();
    const sessionDuration = 24 * 60 * 60 * 1000;
    if (currentTime - session.loginTime > sessionDuration) {
      return false;
    }
  }
  
  // Check for inactivity (optional: 30 minutes)
  if (session.lastActivity) {
    const currentTime = Date.now();
    const inactivityLimit = 30 * 60 * 1000; // 30 minutes
    if (currentTime - session.lastActivity > inactivityLimit) {
      return false;
    }
  }
  
  return true;
}

// Audit logging helper
export function auditLog(action: string, userId?: string, details?: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId,
    details,
    ip: process.env.NODE_ENV === 'production' ? 'REQUEST_IP' : 'localhost',
  };
  
  // In production, this would send to a logging service
  // For now, we'll just console.log with a special prefix
  console.log('[AUDIT]', JSON.stringify(logEntry));
  
  // Store in a mock audit log (in production, use a database)
  if (typeof window === 'undefined') {
    // Server-side only
    try {
      const fs = require('fs');
      const path = require('path');
      const logFile = path.join(process.cwd(), 'logs', 'audit.log');
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    } catch (error) {
      console.error('[AUDIT] Failed to write audit log:', error);
    }
  }
}

// Role-based access control helper
export function hasPermission(user: UserSession | undefined, requiredRole: string): boolean {
  if (!user || !user.isLoggedIn) {
    return false;
  }
  
  // Admin has all permissions
  if (user.isAdmin) {
    return true;
  }
  
  // Check specific role
  if (user.role === requiredRole) {
    return true;
  }
  
  // Role hierarchy
  const roleHierarchy: { [key: string]: number } = {
    'free': 1,
    'trial': 2,
    'downsell': 3,
    'monthly': 4,
    'annual': 5,
    'admin': 10,
  };
  
  const userLevel = roleHierarchy[user.role || 'free'] || 1;
  const requiredLevel = roleHierarchy[requiredRole] || 1;
  
  return userLevel >= requiredLevel;
}