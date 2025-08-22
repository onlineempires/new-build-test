import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, validateSession, auditLog } from '../../../lib/auth/session';

export default withSessionRoute(async function refreshRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = req.session.user;
    
    // Validate existing session
    if (!validateSession(session)) {
      auditLog('SESSION_REFRESH_FAILED', session?.userId, { reason: 'Invalid session' });
      return res.status(401).json({ 
        error: 'Session expired or invalid',
        refreshed: false 
      });
    }

    // Refresh session
    if (session) {
      session.lastActivity = Date.now();
      await req.session.save();
      
      // Log successful refresh
      auditLog('SESSION_REFRESHED', session.userId, {
        role: session.role,
        isAdmin: session.isAdmin,
      });

      return res.status(200).json({
        refreshed: true,
        expiresIn: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        user: {
          userId: session.userId,
          email: session.email,
          role: session.role,
          isAdmin: session.isAdmin,
        },
      });
    }

    return res.status(401).json({ 
      error: 'No session to refresh',
      refreshed: false 
    });
  } catch (error) {
    console.error('[API] Session refresh error:', error);
    auditLog('SESSION_REFRESH_ERROR', undefined, { error: String(error) });
    return res.status(500).json({ 
      error: 'Internal server error',
      refreshed: false 
    });
  }
});