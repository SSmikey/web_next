import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user?.role !== "admin") {
    redirect("/auth/signin?error=AccessDenied")
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: '#666' }}>
          Welcome, {session.user?.name}. You have admin privileges.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', backgroundColor: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>User Management</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Manage user roles and permissions
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            View and modify user roles, create new users, and manage access permissions.
          </p>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', backgroundColor: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>System Settings</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            Configure system-wide settings
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Manage application settings, security configurations, and system preferences.
          </p>
        </div>

        <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', backgroundColor: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Analytics</h2>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            View system analytics and reports
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Monitor system performance, user activity, and generate reports.
          </p>
        </div>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Admin Information</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Role:</strong> {session.user?.role}</p>
          <p><strong>User ID:</strong> {session.user?.id}</p>
        </div>
      </div>
    </div>
  )
}