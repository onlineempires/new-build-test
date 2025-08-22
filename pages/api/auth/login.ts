import type { NextApiRequest, NextApiResponse } from 'next';
import { withSessionRoute, auditLog } from '../../../lib/auth/session';
import crypto from 'crypto';

// Mock user database (in production, use a real database)
const MOCK_USERS = {
  'admin@example.com': {
    id: 'admin-001',
    email: 'admin@example.com',
    password: 'admin123', // In production, use bcrypt hashed passwords
    role: 'admin',
    isAdmin: true,
  },
  'user@example.com': {
    id: 'user-001',
    email: 'user@example.com',
    password: 'user123',
    role: 'monthly',
    isAdmin: false,
  },
};

export default withSessionRoute(async function loginRoute(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      auditLog('LOGIN_FAILED', undefined, { reason: 'Missing credentials', email });
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Rate limiting check (in production, use Redis or similar)
    const attemptKey = `login_attempts_${email}`;
    const maxAttempts = 5;
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    // Mock rate limiting (in production, implement properly)
    // For now, just log the attempt
    console.log(`[Security] Login attempt for ${email}`);

    // Find user (in production, query database)
    const user = MOCK_USERS[email.toLowerCase()];

    if (!user || user.password !== password) {
      auditLog('LOGIN_FAILED', undefined, { 
        reason: 'Invalid credentials', 
        email,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress 
      });
      return res.status(401).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Create session
    req.session.user = {
      isLoggedIn: true,
      isAdmin: user.isAdmin,
      userId: user.id,
      email: user.email,
      role: user.role,
      loginTime: Date.now(),
      lastActivity: Date.now(),
    };

    await req.session.save();

    // Set additional security cookies
    res.setHeader('Set-Cookie', [
      `admin_login_time=${Date.now()}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
    ]);

    // Log successful login
    auditLog('LOGIN_SUCCESS', user.id, {
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    });

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error('[API] Login error:', error);
    auditLog('LOGIN_ERROR', undefined, { error: String(error) });
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});