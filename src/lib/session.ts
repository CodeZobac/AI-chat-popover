import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Extracts session information from the request
 */
export function extractSessionInfo(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 
                   request.cookies.get('session-id')?.value ||
                   generateSessionId();
  
  const ipAddress = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   request.ip || 
                   'unknown';
  
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return {
    sessionId,
    ipAddress,
    userAgent
  };
}

/**
 * Generates a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substr(2, 9);
  return `session_${timestamp}_${randomPart}`;
}

/**
 * Creates or updates a user session in the database
 */
export async function ensureUserSession(sessionInfo: {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
}) {
  try {
    // Try to find existing session
    let session = await prisma.userSession.findUnique({
      where: { sessionId: sessionInfo.sessionId }
    });

    if (!session) {
      // Create new session
      session = await prisma.userSession.create({
        data: {
          sessionId: sessionInfo.sessionId,
          ipAddress: sessionInfo.ipAddress,
          userAgent: sessionInfo.userAgent,
        }
      });
    } else {
      // Update last activity
      session = await prisma.userSession.update({
        where: { sessionId: sessionInfo.sessionId },
        data: {
          lastActivity: new Date(),
          // Update IP and user agent in case they changed
          ipAddress: sessionInfo.ipAddress,
          userAgent: sessionInfo.userAgent,
        }
      });
    }

    return session;
  } catch (error) {
    console.error('Error managing user session:', error);
    // Return a minimal session object if database fails
    return {
      id: 'temp_' + sessionInfo.sessionId,
      sessionId: sessionInfo.sessionId,
      ipAddress: sessionInfo.ipAddress,
      userAgent: sessionInfo.userAgent,
      startTime: new Date(),
      lastActivity: new Date(),
    };
  }
}

/**
 * Validates that a session exists and is active
 */
export async function validateSession(sessionId: string): Promise<boolean> {
  try {
    const session = await prisma.userSession.findUnique({
      where: { sessionId }
    });

    if (!session) {
      return false;
    }

    // Check if session is not too old (e.g., 24 hours)
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const isExpired = Date.now() - session.lastActivity.getTime() > maxAge;

    return !isExpired;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}

/**
 * Cleans up old sessions (can be called periodically)
 */
export async function cleanupOldSessions(maxAgeHours: number = 24) {
  try {
    const cutoffDate = new Date(Date.now() - (maxAgeHours * 60 * 60 * 1000));
    
    const result = await prisma.userSession.deleteMany({
      where: {
        lastActivity: {
          lt: cutoffDate
        }
      }
    });

    console.log(`Cleaned up ${result.count} old sessions`);
    return result.count;
  } catch (error) {
    console.error('Error cleaning up old sessions:', error);
    return 0;
  }
}