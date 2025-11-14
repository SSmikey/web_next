"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileLayout from "./components/ProfileLayout";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <ProfileLayout>
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </ProfileLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <ProfileLayout>
      <div className="profile-content">
        <div className="profile-header">
          <h1>โปรไฟล์ของฉัน</h1>
          <p>จัดการข้อมูลส่วนตัวและการตั้งค่าของคุณ</p>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="avatar-large">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
            </div>
            <div className="user-details">
              <h2>{session.user?.name || "ผู้ใช้"}</h2>
              <p className="email">{session.user?.email}</p>
              <p className="role">บทบาท: {session.user?.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้ใช้ทั่วไป"}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">การสั่งซื้อ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">สินค้าที่ชื่นชอบ</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">0</div>
              <div className="stat-label">รีวิว</div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-primary">แก้ไขโปรไฟล์</button>
            <button className="btn-secondary">เปลี่ยนรหัสผ่าน</button>
          </div>
        </div>

        <div className="recent-activity">
          <h3>กิจกรรมล่าสุด</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p>ยังไม่มีกิจกรรมล่าสุด</p>
                <span className="activity-time">เริ่มต้นใช้งาน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header {
          margin-bottom: 2rem;
        }

        .profile-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .profile-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .profile-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 2rem;
          color: white;
        }

        .user-details h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .email {
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .role {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #f3f4f6;
          color: #374151;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .recent-activity {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .recent-activity h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .activity-icon {
          font-size: 1.5rem;
        }

        .activity-content p {
          color: #374151;
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          color: #6b7280;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .profile-info {
            flex-direction: column;
            text-align: center;
          }

          .profile-stats {
            grid-template-columns: 1fr;
          }

          .profile-actions {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </ProfileLayout>
  );
}