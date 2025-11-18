import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import CreateAdminForm from "./CreateAdminForm"

export default async function CreateAdminPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user?.role !== "admin") {
    redirect("/auth/signin?error=AccessDenied")
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Create Admin User</h1>
        <p style={{ color: '#666' }}>
          Create a new admin user with full system access.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '1.5rem', backgroundColor: 'white' }}>
        <CreateAdminForm />
      </div>
    </div>
  )
}