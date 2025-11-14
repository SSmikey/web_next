"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileLayout from "../components/ProfileLayout";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    if (session.user?.role !== "admin") {
      router.push("/profile");
      return;
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

  if (!session || session.user?.role !== "admin") {
    return null;
  }

  return (
    <ProfileLayout>
      <div className="dashboard-content">
        <div className="page-header">
          <h1>แดชบอร์ดผู้ดูแลระบบ</h1>
          <p>จัดการและตรวจสอบข้อมูลระบบ</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>ผู้ใช้ทั้งหมด</h3>
              <div className="stat-number">0</div>
              <div className="stat-change positive">+0% เดือนนี้</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orders">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11H3v10h6V11z"></path>
                <path d="M15 3H9v18h6V3z"></path>
                <path d="M21 7h-6v14h6V7z"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>คำสั่งซื้อ</h3>
              <div className="stat-number">0</div>
              <div className="stat-change positive">+0% เดือนนี้</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon products">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </div>
            <div className="stat-info">
              <h3>สินค้า</h3>
              <div className="stat-number">0</div>
              <div className="stat-change neutral">0% เดือนนี้</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
            <div className="stat-info">
              <h3>รายได้</h3>
              <div className="stat-number">฿0</div>
              <div className="stat-change positive">+0% เดือนนี้</div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>คำสั่งซื้อล่าสุด</h3>
              <button className="btn-link">ดูทั้งหมด</button>
            </div>
            <div className="card-content">
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>ยังไม่มีคำสั่งซื้อ</p>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3>ผู้ใช้ล่าสุด</h3>
              <button className="btn-link">ดูทั้งหมด</button>
            </div>
            <div className="card-content">
              <div className="empty-state">
                <div className="empty-icon">👥</div>
                <p>ยังไม่มีผู้ใช้ใหม่</p>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card full-width">
          <div className="card-header">
            <h3>กราฐานระบบ</h3>
            <div className="status-indicators">
              <div className="status-item">
                <div className="status-dot online"></div>
                <span>ฐานข้อมูล</span>
              </div>
              <div className="status-item">
                <div className="status-dot online"></div>
                <span>API Server</span>
              </div>
              <div className="status-item">
                <div className="status-dot online"></div>
                <span>Storage</span>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="system-stats">
              <div className="system-stat">
                <div className="stat-label">CPU Usage</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "25%" }}></div>
                </div>
                <div className="stat-value">25%</div>
              </div>
              <div className="system-stat">
                <div className="stat-label">Memory</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "40%" }}></div>
                </div>
                <div className="stat-value">40%</div>
              </div>
              <div className="system-stat">
                <div className="stat-label">Storage</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: "15%" }}></div>
                </div>
                <div className="stat-value">15%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .stat-icon.users {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .stat-icon.orders {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .stat-icon.products {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .stat-icon.revenue {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .stat-info h3 {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0 0 0.25rem 0;
          font-weight: 500;
        }

        .stat-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .stat-change {
          font-size: 0.8rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .stat-change.negative {
          color: #ef4444;
        }

        .stat-change.neutral {
          color: #6b7280;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          overflow: hidden;
        }

        .dashboard-card.full-width {
          grid-column: 1 / -1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .card-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .btn-link {
          background: none;
          border: none;
          color: #667eea;
          font-weight: 500;
          cursor: pointer;
          font-size: 0.9rem;
          transition: color 0.2s ease;
        }

        .btn-link:hover {
          color: #5a67d8;
        }

        .status-indicators {
          display: flex;
          gap: 1rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #374151;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-dot.online {
          background: #10b981;
        }

        .status-dot.offline {
          background: #ef4444;
        }

        .card-content {
          padding: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 2rem 1rem;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .empty-state p {
          color: #6b7280;
          margin: 0;
        }

        .system-stats {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .system-stat {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-label {
          min-width: 100px;
          font-weight: 500;
          color: #374151;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .stat-value {
          min-width: 40px;
          text-align: right;
          font-weight: 600;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .status-indicators {
            flex-wrap: wrap;
          }

          .system-stat {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }

          .stat-label {
            min-width: auto;
          }

          .stat-value {
            min-width: auto;
            text-align: left;
          }
        }
      `}</style>
    </ProfileLayout>
  );
}