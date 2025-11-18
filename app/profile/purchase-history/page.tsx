"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import ProfileLayout from "../components/ProfileLayout";
import styles from "./page.module.css";

const statusLabels = {
  pending: "รอชำระเงิน",
  waiting_payment: "รอตรวจสอบการชำระเงิน",
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelingOrderId, setCancelingOrderId] = useState<string | null>(null);
  const [uploadingSlip, setUploadingSlip] = useState(false);
  const [paymentSettings, setPaymentSettings] = useState<{
    bankName: string;
    accountName: string;
    accountNumber: string;
    qrCodeImage: string;
  }>({
    bankName: '',
    accountName: '',
    accountNumber: '',
    qrCodeImage: ''
  });
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
      fetchPaymentSettings();
    }
  }, [fetchOrders, session]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/payment-settings');
      if (response.ok) {
        const data = await response.json();
        setPaymentSettings(data);
      }
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    }
  };

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

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleShowPaymentPopup = (order: any) => {
    setSelectedOrder(order);
    setShowPaymentPopup(true);
  };

  const handlePaymentSlipUpload = async (orderId: string, file: File) => {
    if (!file) {
      alert('กรุณาเลือกไฟล์สลิปการโอนเงิน');
      return;
    }

    setUploadingSlip(true);
    
    try {
      const formData = new FormData();
      formData.append('paymentSlip', file);
      
      const response = await fetch(`/api/orders/${orderId}/payment-slip`, {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        alert('อัปโหลดสลิปการโอนเงินสำเร็จแล้ว');
        setShowPaymentPopup(false);
        // Refresh orders list
        fetchOrders();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to upload payment slip');
      }
    } catch (error) {
      console.error('Error uploading payment slip:', error);
      alert('Failed to upload payment slip. Please try again.');
    } finally {
      setUploadingSlip(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancelingOrderId(orderId);
    setShowCancelConfirm(true);
  };

  const confirmCancelOrder = async () => {
    if (!cancelingOrderId) return;
    
    try {
      const response = await fetch(`/api/orders/${cancelingOrderId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Refresh orders list
        fetchOrders();
        setShowCancelConfirm(false);
        setCancelingOrderId(null);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return styles.statusPending;
      case "waiting_payment": return styles.statusWaitingPayment;
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
              รอชำระเงิน
            </button>
            <button
              className={`${styles.filterTab} ${activeFilter === "waiting_payment" ? styles.active : ""}`}
              onClick={() => handleFilterChange("waiting_payment")}
            >
              รอตรวจสอบการชำระเงิน
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
                          <div className={styles.itemImage}>
                            {item.image && item.image !== "👕" ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className={styles.productImage}
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = '<div style="font-size: 40px">👕</div>';
                                  }
                                }}
                              />
                            ) : (
                              <div style={{ fontSize: '40px' }}>👕</div>
                            )}
                          </div>
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
                        <button
                          className={styles.btnSecondary}
                          onClick={() => handleViewOrderDetails(order)}
                        >
                          ดูรายละเอียด
                        </button>
                        {order.status === "delivered" && (
                          <button className={styles.btnSecondary}>
                            รีวิวสินค้า
                          </button>
                        )}
                        {(order.status === "pending" || order.status === "waiting_payment") && (
                          <button
                            className={`${styles.btnSecondary} ${styles.btnPayment}`}
                            onClick={() => handleShowPaymentPopup(order)}
                          >
                            {order.status === "pending" ? "ชำระเงิน" : "อัปโหลดสลิปใหม่"}
                          </button>
                        )}
                        {order.status === "pending" && (
                          <button
                            className={`${styles.btnSecondary} ${styles.btnCancel}`}
                            onClick={() => handleCancelOrder(order.id)}
                          >
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

        {/* Order Details Popup */}
        {showOrderDetails && selectedOrder && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
              <div className={styles.popupHeader}>
                <button
                  className={styles.popupCloseButton}
                  onClick={() => setShowOrderDetails(false)}
                >
                  ×
                </button>
                <h2 className={styles.popupTitle}>รายละเอียดคำสั่งซื้อ</h2>
                <p className={styles.popupSubtitle}>เลขที่ออเดอร์: {selectedOrder.orderNumber}</p>
              </div>
              
              <div className={styles.popupBody}>
                <div className={styles.orderInfoSection}>
                  <h3 className={styles.sectionTitle}>ข้อมูลคำสั่งซื้อ</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>เลขที่ออเดอร์:</span>
                    <span className={styles.infoValue}>{selectedOrder.orderNumber}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>วันที่สั่งซื้อ:</span>
                    <span className={styles.infoValue}>{formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>สถานะ:</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(selectedOrder.status)}`}>
                      {statusLabels[selectedOrder.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>วิธีการจัดส่ง:</span>
                    <span className={styles.infoValue}>{selectedOrder.shippingMethod === 'mail' ? 'ไปรษณีย์' : 'รับสินค้าเอง'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ค่าจัดส่ง:</span>
                    <span className={styles.infoValue}>฿{selectedOrder.shippingCost?.toLocaleString() || '0'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>วิธีการชำระเงิน:</span>
                    <span className={styles.infoValue}>โอนเงินผ่านธนาคาร</span>
                  </div>
                  {selectedOrder.paymentSlip && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>สลิปการโอนเงิน:</span>
                      <span className={styles.infoValue}>
                        <button
                          className={styles.viewSlipButton}
                          onClick={() => window.open(selectedOrder.paymentSlip.url, '_blank')}
                        >
                          ดูสลิป
                        </button>
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.customerInfoSection}>
                  <h3 className={styles.sectionTitle}>ข้อมูลผู้สั่งซื้อ</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ชื่อ-นามสกุล:</span>
                    <span className={styles.infoValue}>
                      {selectedOrder.customerInfo?.firstName} {selectedOrder.customerInfo?.lastName}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>อีเมล:</span>
                    <span className={styles.infoValue}>{selectedOrder.customerInfo?.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>เบอร์โทร:</span>
                    <span className={styles.infoValue}>{selectedOrder.customerInfo?.phone}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ที่อยู่จัดส่ง:</span>
                    <span className={styles.infoValue}>{selectedOrder.customerInfo?.address}</span>
                  </div>
                  {selectedOrder.customerInfo?.note && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>หมายเหตุ:</span>
                      <span className={styles.infoValue}>{selectedOrder.customerInfo.note}</span>
                    </div>
                  )}
                </div>

                <div className={styles.itemsSection}>
                  <h3 className={styles.sectionTitle}>รายการสินค้า</h3>
                  {selectedOrder.items.map((item: any) => (
                    <div key={item.id} className={styles.detailItem}>
                      <div className={styles.detailItemImage}>
                        {item.image && item.image !== "👕" ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.detailProductImage}
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div style="font-size: 40px">👕</div>';
                              }
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: '40px' }}>👕</div>
                        )}
                      </div>
                      <div className={styles.detailItemInfo}>
                        <div className={styles.detailItemName}>{item.name}</div>
                        <div className={styles.detailItemPrice}>฿{item.price.toLocaleString()}</div>
                        <div className={styles.detailItemQuantity}>จำนวน: {item.quantity}</div>
                        <div className={styles.detailItemSize}>ขนาด: {item.size}</div>
                        <div className={styles.detailItemTotal}>
                          รวม: ฿{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.totalSection}>
                  <div className={styles.subtotalRow}>
                    <span className={styles.totalLabel}>ราคาสินค้า:</span>
                    <span className={styles.totalValue}>฿{selectedOrder.totalAmount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>ยอดรวมทั้งหมด:</span>
                    <span className={styles.totalValue}>฿{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.popupFooter}>
                <button
                  className={`${styles.popupButton} ${styles.popupButtonPrimary}`}
                  onClick={() => setShowOrderDetails(false)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Confirmation Popup */}
        {showCancelConfirm && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
              <div className={styles.popupHeader}>
                <h2 className={styles.popupTitle}>ยืนยันการยกเลิกคำสั่งซื้อ</h2>
              </div>
              
              <div className={styles.popupBody}>
                <p className={styles.confirmMessage}>
                  คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?
                </p>
                <p className={styles.confirmSubMessage}>
                  หลังจากยกเลิกแล้ว คุณจะไม่สามารถกู้คืนคำสั่งซื้อนี้ได้
                </p>
              </div>
              
              <div className={styles.popupFooter}>
                <button
                  className={`${styles.popupButton} ${styles.popupButtonSecondary}`}
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelingOrderId(null);
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  className={`${styles.popupButton} ${styles.popupButtonDanger}`}
                  onClick={confirmCancelOrder}
                >
                  ยืนยันการยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Popup */}
        {showPaymentPopup && selectedOrder && (
          <div className={styles.popupOverlay}>
            <div className={styles.popupContainer}>
              <div className={styles.popupHeader}>
                <button
                  className={styles.popupCloseButton}
                  onClick={() => setShowPaymentPopup(false)}
                >
                  ×
                </button>
                <h2 className={styles.popupTitle}>ชำระเงินสำหรับคำสั่งซื้อ</h2>
                <p className={styles.popupSubtitle}>เลขที่ออเดอร์: {selectedOrder.orderNumber}</p>
              </div>
              
              <div className={styles.popupBody}>
                <div className={styles.paymentInfoSection}>
                  <h3 className={styles.sectionTitle}>ข้อมูลการชำระเงิน</h3>
                  
                  <div className={styles.paymentInfoCard}>
                    <div className={styles.paymentInfoRow}>
                      <span className={styles.paymentInfoLabel}>ชื่อธนาคาร:</span>
                      <span className={styles.paymentInfoValue}>{paymentSettings.bankName || 'ธนาคารกสิกรไทย'}</span>
                    </div>
                    <div className={styles.paymentInfoRow}>
                      <span className={styles.paymentInfoLabel}>ชื่อบัญชี:</span>
                      <span className={styles.paymentInfoValue}>{paymentSettings.accountName || 'สมชาย ใจดี'}</span>
                    </div>
                    <div className={styles.paymentInfoRow}>
                      <span className={styles.paymentInfoLabel}>เลขที่บัญชี:</span>
                      <span className={styles.paymentInfoValue}>{paymentSettings.accountNumber || '123-456-7890'}</span>
                    </div>
                    <div className={styles.paymentInfoRow}>
                      <span className={styles.paymentInfoLabel}>จำนวนเงิน:</span>
                      <span className={styles.paymentInfoValue}>฿{selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className={styles.qrCodeSection}>
                    <h4 className={styles.qrCodeTitle}>สแกน QR Code เพื่อชำระเงิน</h4>
                    <div className={styles.qrCodeContainer}>
                      <img
                        src={paymentSettings.qrCodeImage || "/images/QR code for ordering.png"}
                        alt="QR Code for Payment"
                        className={styles.qrCodeImage}
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 200px; background: #f8f9fa; border-radius: 8px; color: #666;">QR Code ไม่สามารถแสดงได้</div>';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.slipUploadSection}>
                    <h4 className={styles.slipUploadTitle}>อัปโหลดสลิปการโอนเงิน</h4>
                    <div className={styles.slipUploadContainer}>
                      <input
                        type="file"
                        id="paymentSlip"
                        accept="image/*"
                        className={styles.slipUploadInput}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePaymentSlipUpload(selectedOrder.id, file);
                          }
                        }}
                      />
                      <label
                        htmlFor="paymentSlip"
                        className={`${styles.slipUploadLabel} ${uploadingSlip ? styles.uploading : ''}`}
                      >
                        {uploadingSlip ? 'กำลังอัปโหลด...' : 'เลือกไฟล์สลิป'}
                      </label>
                      <p className={styles.slipUploadNote}>
                        รองรับไฟล์ JPEG, PNG, WebP ขนาดไม่เกิน 5MB
                      </p>
                    </div>
                  </div>

                  {selectedOrder.status === "waiting_payment" && selectedOrder.paymentSlip && (
                    <div className={styles.uploadedSlipSection}>
                      <h4 className={styles.uploadedSlipTitle}>สลิปที่อัปโหลดแล้ว</h4>
                      <div className={styles.uploadedSlipContainer}>
                        <img
                          src={selectedOrder.paymentSlip.url}
                          alt="Payment Slip"
                          className={styles.uploadedSlipImage}
                          onClick={() => window.open(selectedOrder.paymentSlip.url, '_blank')}
                        />
                        <p className={styles.uploadedSlipDate}>
                          อัปโหลดเมื่อ: {new Date(selectedOrder.paymentSlip.uploadedAt).toLocaleString('th-TH')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className={styles.popupFooter}>
                <button
                  className={`${styles.popupButton} ${styles.popupButtonSecondary}`}
                  onClick={() => setShowPaymentPopup(false)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}