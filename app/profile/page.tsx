"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileLayout from "./components/ProfileLayout";

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  
  // Change password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleUpdateProfile = async () => {
    if (!editName || !editEmail) {
      alert('กรุณากรอกชื่อและอีเมลให้ครบถ้วน');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      alert('รูปแบบอีเมลไม่ถูกต้อง');
      return;
    }

    setUpdatingProfile(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert('อัปเดตโปรไฟล์สำเร็จแล้ว');
        setIsEditingProfile(false);
        // Update session
        if (update) {
          await update({
            ...session,
            user: {
              ...session?.user,
              name: editName,
              email: editEmail,
            },
          });
        }
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (newPassword.length < 6) {
      alert('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setChangingPassword(true);
    
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      if (response.ok) {
        alert('เปลี่ยนรหัสผ่านสำเร็จแล้ว');
        setIsChangingPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
    if (session) {
      setEditName(session.user?.name || "");
      setEditEmail(session.user?.email || "");
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
            <button
              className="btn-primary"
              onClick={() => setIsEditingProfile(true)}
            >
              แก้ไขโปรไฟล์
            </button>
            <button
              className="btn-secondary"
              onClick={() => setIsChangingPassword(true)}
            >
              เปลี่ยนรหัสผ่าน
            </button>
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

        {/* Edit Profile Modal */}
        {isEditingProfile && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>แก้ไขโปรไฟล์</h2>
                <button
                  className="close-button"
                  onClick={() => setIsEditingProfile(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>ชื่อ</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>อีเมล</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setIsEditingProfile(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn-primary"
                  onClick={handleUpdateProfile}
                  disabled={updatingProfile}
                >
                  {updatingProfile ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isChangingPassword && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h2>เปลี่ยนรหัสผ่าน</h2>
                <button
                  className="close-button"
                  onClick={() => setIsChangingPassword(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>รหัสผ่านปัจจุบัน</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-secondary"
                  onClick={() => setIsChangingPassword(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn-primary"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
                </button>
              </div>
            </div>
          </div>
        )}
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
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .profile-header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .profile-card {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 2rem;
          box-shadow: var(--shadow-sm);
          margin-bottom: 2rem;
        }

        .profile-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid var(--border-light);
        }

        .avatar-large {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: var(--gradient-primary);
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
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .email {
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .role {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: var(--bg-tertiary);
          color: var(--text-secondary);
          border-radius: var(--radius-full);
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
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .profile-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background: var(--gradient-primary);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: var(--bg-tertiary);
          color: var(--text-primary);
        }

        .btn-secondary:hover {
          background: var(--border-light);
        }

        .recent-activity {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .recent-activity h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
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
          background: var(--bg-tertiary);
          border-radius: var(--radius-md);
        }

        .activity-icon {
          font-size: 1.5rem;
        }

        .activity-content p {
          color: var(--text-primary);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          color: var(--text-secondary);
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-container {
          background: var(--bg-card);
          border-radius: var(--radius-lg);
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          box-shadow: var(--shadow-lg);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          color: var(--text-primary);
          font-size: 1.5rem;
          font-weight: 600;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-button:hover {
          color: var(--text-primary);
        }

        .modal-body {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent-primary);
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .modal-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .modal-footer {
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