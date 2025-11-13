import { getServerSession } from "next-auth/next"
import { authOptions } from "../app/api/auth/[...nextauth]/route"

export type UserRole = "admin" | "user"

export interface AuthUser {
  id: string
  name?: string | null
  email?: string | null
  role?: UserRole
}

/**
 * Check if the current user has admin role
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return session?.user?.role === "admin"
}

/**
 * Check if the current user is authenticated
 * @returns Promise<boolean> - true if user is authenticated, false otherwise
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  return !!session
}

/**
 * Get the current user session
 * @returns Promise<AuthUser | null> - current user session or null
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }
  
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role as UserRole
  }
}

/**
 * Check if the current user has the specified role or higher
 * @param requiredRole - the minimum required role
 * @returns Promise<boolean> - true if user has required role or higher
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.role) {
    return false
  }

  // Role hierarchy: admin > user
  if (requiredRole === "user") {
    return session.user.role === "user" || session.user.role === "admin"
  }
  
  if (requiredRole === "admin") {
    return session.user.role === "admin"
  }

  return false
}

/**
 * Server-side function to protect routes that require admin role
 * @throws Error if user is not authenticated or not admin
 */
export async function requireAdmin(): Promise<AuthUser> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Authentication required")
  }
  
  if (session.user?.role !== "admin") {
    throw new Error("Admin role required")
  }
  
  return session.user as AuthUser
}

/**
 * Server-side function to protect routes that require authentication
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Authentication required")
  }
  
  return session.user as AuthUser
}

/**
 * Check if a user can perform an action on another user
 * @param targetUserId - the ID of the user being acted upon
 * @returns Promise<boolean> - true if action is allowed
 */
export async function canModifyUser(targetUserId: string): Promise<boolean> {
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    return false
  }
  
  // Admins can modify any user except themselves (for role changes)
  if (currentUser.role === "admin") {
    return true
  }
  
  // Users can only modify themselves
  return currentUser.id === targetUserId
}