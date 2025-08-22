import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, auditLog } from '../../../lib/auth/session';

export default withSessionRoute(async function logoutRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Accept both GET and POST for logout
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const userId = req.session.user?.userId;
    const email = req.session.user?.email;
    const role = req.session.user?.role;

    // Log logout event for audit
    if (userId) {
      auditLog('LOGOUT', userId, { 
        email, 
        role,
        logoutTime: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
      console.log(`[Logout] User ${email} (${userId}) logged out at ${new Date().toISOString()}`);
    }

    // Destroy the iron-session
    req.session.destroy();

    // Clear all auth-related cookies comprehensively
    const cookiesToClear = [
      'admin_session',
      'admin_login_time',
      'auth_token',
      'session',
      'connect.sid',
      'user_session',
    ];

    const clearCookieOptions = [
      'Path=/',
      'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'HttpOnly',
      'SameSite=Lax',
      process.env.NODE_ENV === 'production' ? 'Secure' : '',
    ].filter(Boolean).join('; ');

    // Set multiple Set-Cookie headers to clear all possible cookies
    const setCookieHeaders = cookiesToClear.map(
      cookieName => `${cookieName}=; ${clearCookieOptions}`
    );

    // Also clear cookies with different paths that might exist
    const additionalClearHeaders = cookiesToClear.flatMap(cookieName => [
      `${cookieName}=; Path=/admin; ${clearCookieOptions}`,
      `${cookieName}=; Path=/api; ${clearCookieOptions}`,
    ]);

    res.setHeader('Set-Cookie', [...setCookieHeaders, ...additionalClearHeaders]);

    // Set cache control headers to prevent caching of the logout response
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('[API] Logout error:', error);
    
    // Even if there's an error, try to destroy the session
    try {
      req.session.destroy();
    } catch (destroyError) {
      console.error('[API] Failed to destroy session:', destroyError);
    }

    // Log the error for audit
    auditLog('LOGOUT_ERROR', req.session?.user?.userId || 'unknown', { 
      error: String(error),
      timestamp: new Date().toISOString(),
    });

    // Still return success to allow client to clear local state
    return res.status(200).json({ 
      success: true,
      message: 'Logged out with warnings',
      warning: 'Some server-side cleanup may have failed, but local session cleared',
    });
  }
});