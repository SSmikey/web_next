"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ProfileLayout from "../components/ProfileLayout";
import styles from "./page.module.css";

const statusLabels = {
  pending: "รอดำเนินการ",
  processing: "กำลังดำเนินการ",
  shipped: "จัดส่งแล้ว",
  delivered: "จัดส่งสำเร็จ",
  cancelled: "ยกเลิก"
};

export default function PurchaseHistoryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

  // Fetch orders from API
  const fetchOrders = useCallback(async () => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
        status: activeFilter,
        search: searchQuery,
        timeFilter: timeFilter,
        sortBy: sortBy
      });
      
      const response = await fetch(`/api/purchase-history?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      // In case of error, we could set some default empty state
      setOrders([]);
      setFilteredOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [session, currentPage, activeFilter, searchQuery, timeFilter, sortBy, ordersPerPage]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [fetchOrders, session]);

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return styles.statusPending;
      case "processing": return styles.statusProcessing;
      case "shipped": return styles.statusShipped;
      case "delivered": return styles.statusDelivered;
      case "cancelled": return styles.statusCancelled;
      default: return "";
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };

  // The API already handles pagination, so we use the orders directly
  const currentOrders = filteredOrders;

  if (status === "loading") {
    return (
      <ProfileLayout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner}></div>
            <p>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <ProfileLayout>
      <div className={styles.purchaseHistoryContent}>
        <div className={styles.pageHeader}>
          <h1>ประวัติการซื้อ</h1>
          <p>ดูรายการสินค้าที่คุณเคยสั่งซื้อทั้งหมด</p>
        </div>

        <div className={styles.filtersSection}>
          <div className={styles.filterTabs}>
            <button
              className={`${styles.filterTab} ${activeFilter === "all" ? styles.active : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              ทั้งหมด
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "pending" ? styles.active : ""}`}
              onClick={() => handleFilterChange("pending")}
            >
              รอดำเนินการ
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "processing" ? styles.active : ""}`}
              onClick={() => handleFilterChange("processing")}
            >
              กำลังดำเนินการ
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "shipped" ? styles.active : ""}`}
              onClick={() => handleFilterChange("shipped")}
            >
              จัดส่งแล้ว
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "delivered" ? styles.active : ""}`}
              onClick={() => handleFilterChange("delivered")}
            >
              สำเร็จ
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "cancelled" ? styles.active : ""}`}
              onClick={() => handleFilterChange("cancelled")}
            >
              ยกเลิก
            </button>
          </div>
          
          <div className={styles.searchFilter}>
            <input
              type="text"
              placeholder="ค้นหาคำสั่งซื้อ..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            <select
              className={styles.filterSelect}
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
            >
              <option value="">ทุกช่วงเวลา</option>
              <option value="7">7 วันล่าสุด</option>
              <option value="30">30 วันล่าสุด</option>
              <option value="90">3 เดือนล่าสุด</option>
              <option value="365">1 ปีล่าสุด</option>
            </select>
            <select
              className={styles.filterSelect}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="date-desc">วันที่ (ล่าสุดก่อน)</option>
              <option value="date-asc">วันที่ (เก่าสุดก่อน)</option>
              <option value="total-desc">ยอดรวม (สูงสุดก่อน)</option>
              <option value="total-asc">ยอดรวม (ต่ำสุดก่อน)</option>
              <option value="status">สถานะ</option>
            </select>
          </div>
        </div>

        <div className={styles.ordersContainer}>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <div key={order.orderNumber || order.id} className={styles.orderCard}>
                <div
                  className={styles.orderHeader}
                  onClick={() => toggleOrderExpansion(order.orderNumber || order.id)}
                >
                  <div className={styles.orderHeaderLeft}>
                    <div className={styles.orderNumber}>{order.orderNumber || order.id}</div>
                    <div className={styles.orderDate}>{formatDate(order.date)}</div>
                  </div>
                  <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                    {statusLabels[order.status as keyof typeof statusLabels]}
                  </div>
                </div>
               
                {expandedOrders.includes(order.orderNumber || order.id) && (
                  <div className={styles.orderBody}>
                    <div className={styles.orderItems}>
                      {order.items.map((item: any) => (
                        <div key={item.id} className={styles.orderItem}>
                          <div className={styles.itemImage}>{item.image}</div>
                          <div className={styles.itemDetails}>
                            <div className={styles.itemName}>{item.name}</div>
                            <div className={styles.itemPrice}>฿{item.price.toLocaleString()}</div>
                            <div className={styles.itemQuantity}>จำนวน: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className={styles.orderFooter}>
                      <div className={styles.orderTotal}>
                        ยอดรวม: ฿{order.total.toLocaleString()}
                      </div>
                      <div className={styles.orderActions}>
                        <button className={styles.btnSecondary}>
                          ดูรายละเอียด
                        </button>
                        {order.status === "delivered" && (
                          <button className={styles.btnSecondary}>
                            รีวิวสินค้า
                          </button>
                        )}
                        {order.status === "pending" && (
                          <button className={styles.btnSecondary}>
                            ยกเลิกคำสั่งซื้อ
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>ไม่พบประวัติการซื้อ</h3>
              <p>ไม่พบคำสั่งซื้อที่ตรงกับเงื่อนไขที่คุณค้นหา</p>
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  handleFilterChange("all");
                  handleSearchChange("");
                  handleTimeFilterChange("");
                }}
              >
                ล้างตัวกรอง
              </button>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              ก่อนหน้า
            </button>
            
            <div className={styles.paginationNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`${styles.paginationNumber} ${currentPage === page ? styles.active : ""}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button 
              className={styles.paginationBtn}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}