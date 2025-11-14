"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileLayout from "../components/ProfileLayout";

export default function PurchaseHistoryPage() {
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
      <div className="purchase-history-content">
        <div className="page-header">
          <h1>ประวัติการซื้อ</h1>
          <p>ดูรายการสินค้าที่คุณเคยสั่งซื้อทั้งหมด</p>
        </div>

        <div className="filters-section">
          <div className="filter-tabs">
            <button className="filter-tab active">ทั้งหมด</button>
            <button className="filter-tab">กำลังดำเนินการ</button>
            <button className="filter-tab">สำเร็จ</button>
            <button className="filter-tab">ยกเลิก</button>
          </div>
          
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="ค้นหาคำสั่งซื้อ..." 
              className="search-input"
            />
            <select className="filter-select">
              <option value="">ทุกช่วงเวลา</option>
              <option value="7">7 วันล่าสุด</option>
              <option value="30">30 วันล่าสุด</option>
              <option value="90">3 เดือนล่าสุด</option>
              <option value="365">1 ปีล่าสุด</option>
            </select>
          </div>
        </div>

        <div className="orders-container">
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>ยังไม่มีประวัติการซื้อ</h3>
            <p>คุณยังไม่เคยสั่งซื้อสินค้าจากร้านของเรา</p>
            <button className="btn-primary">เริ่มช้อปปิ้ง</button>
          </div>
        </div>

        <div className="pagination">
          <button className="pagination-btn" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            ก่อนหน้า
          </button>
          
          <div className="pagination-numbers">
            <button className="pagination-number active">1</button>
          </div>
          
          <button className="pagination-btn" disabled>
            ถัดไป
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .purchase-history-content {
          max-width: 1000px;
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

        .filters-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
        }

        .filter-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 0.5rem 1rem;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-tab:hover {
          background: #e5e7eb;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .search-filter {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 200px;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.95rem;
          background: white;
          cursor: pointer;
        }

        .filter-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .orders-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 2rem;
          min-height: 400px;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
        }

        .pagination-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f3f4f6;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-numbers {
          display: flex;
          gap: 0.5rem;
        }

        .pagination-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          color: #374151;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .pagination-number:hover {
          background: #f3f4f6;
        }

        .pagination-number.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 1.75rem;
          }

          .filter-tabs {
            gap: 0.25rem;
          }

          .filter-tab {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }

          .search-filter {
            flex-direction: column;
          }

          .search-input {
            min-width: auto;
          }

          .pagination {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </ProfileLayout>
  );
}