import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, validateSession, auditLog } from '../../../lib/auth/session';

export default withSessionRoute(async function validateRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = req.session.user;
    
    // Validate session
    if (!validateSession(session)) {
      auditLog('SESSION_VALIDATION_FAILED', session?.userId);
      return res.status(401).json({ 
        error: 'Invalid or expired session',
        valid: false 
      });
    }

    // Update last activity
    if (session) {
      session.lastActivity = Date.now();
      await req.session.save();
    }

    // Log successful validation
    auditLog('SESSION_VALIDATED', session?.userId, {
      role: session?.role,
      isAdmin: session?.isAdmin,
    });

    return res.status(200).json({
      valid: true,
      user: {
        userId: session?.userId,
        email: session?.email,
        role: session?.role,
        isAdmin: session?.isAdmin,
      },
    });
  } catch (error) {
    console.error('[API] Session validation error:', error);
    auditLog('SESSION_VALIDATION_ERROR', undefined, { error: String(error) });
    return res.status(500).json({ 
      error: 'Internal server error',
      valid: false 
    });
  }
});