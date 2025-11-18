'use client';

import { useState, useEffect } from 'react';
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import styles from './page.module.css';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'waiting_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  subtotal: number;
  shippingCost: number;
  customerInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    note?: string;
  };
  items: Array<{
    productId: string;
    productName: string;
    productDescription: string;
    price: number;
    quantity: number;
    size: string;
    imageUrl?: string;
  }>;
  paymentInfo?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    qrCodeUrl?: string;
  };
  paymentSlip?: {
    url: string;
    uploadedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: {
    pending: number;
    waiting_payment: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    status: string;
    total: number;
    date: string;
  }>;
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  if (session.user?.role !== "admin") {
    redirect("/auth/signin?error=AccessDenied");
  }

  return <AdminDashboard session={session} />;
}

function AdminDashboard({ session }: { session: any }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    bankName: '',
    accountName: '',
    accountNumber: '',
    qrCodeUrl: ''
  });

  useEffect(() => {
    fetchStats();
    fetchOrders();
  }, [currentPage, statusFilter, searchQuery]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        status: statusFilter,
        search: searchQuery
      });
      
      const response = await fetch(`/api/admin/orders?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        }),
      });

      if (response.ok) {
        fetchOrders();
        fetchStats();
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentInfoUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setEditingPayment(true);
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          paymentInfo
        }),
      });

      if (response.ok) {
        setSelectedOrder({ ...selectedOrder, paymentInfo });
        setEditingPayment(false);
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating payment info:', error);
    } finally {
      setEditingPayment(false);
    }
  };

  const openOrderModal = (order: Order) => {
    setSelectedOrder(order);
    setPaymentInfo({
      bankName: order.paymentInfo?.bankName || '',
      accountName: order.paymentInfo?.accountName || '',
      accountNumber: order.paymentInfo?.accountNumber || '',
      qrCodeUrl: order.paymentInfo?.qrCodeUrl || ''
    });
    setShowOrderModal(true);
  };

  const closeModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
    setEditingPayment(false);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      pending: styles.statusBadge + '.pending',
      waiting_payment: styles.statusBadge + '.waiting_payment',
      processing: styles.statusBadge + '.processing',
      shipped: styles.statusBadge + '.shipped',
      delivered: styles.statusBadge + '.delivered',
      cancelled: styles.statusBadge + '.cancelled'
    };
    return statusClasses[status] || statusClasses.pending;
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'รอดำเนินการ',
      waiting_payment: 'รอการชำระเงิน',
      processing: 'กำลังดำเนินการ',
      shipped: 'จัดส่งแล้ว',
      delivered: 'จัดส่งสำเร็จ',
      cancelled: 'ยกเลิก'
    };
    return statusMap[status] || status;
  };

  if (loading && !stats) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p>กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>📊 แดชบอร์ดผู้ดูแลระบบ</h1>
        <p className={styles.subtitle}>
          ยินดีต้อนรับ, {session.user?.name}. คุณมีสิทธิ์ผู้ดูแลระบบ
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>ผู้ใช้ทั้งหมด</span>
              <div className={`${styles.statIcon} ${styles.statIcon + '.users'}`}>👥</div>
            </div>
            <div className={styles.statValue}>{stats.totalUsers.toLocaleString()}</div>
            <div className={styles.statChange}>+0% เดือนนี้</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>คำสั่งซื้อทั้งหมด</span>
              <div className={`${styles.statIcon} ${styles.statIcon + '.orders'}`}>📦</div>
            </div>
            <div className={styles.statValue}>{stats.totalOrders.toLocaleString()}</div>
            <div className={styles.statChange}>+0% เดือนนี้</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>รายได้ทั้งหมด</span>
              <div className={`${styles.statIcon} ${styles.statIcon + '.revenue'}`}>💰</div>
            </div>
            <div className={styles.statValue}>฿{stats.totalRevenue.toLocaleString()}</div>
            <div className={styles.statChange}>+0% เดือนนี้</div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>รอดำเนินการ</span>
              <div className={`${styles.statIcon} ${styles.statIcon + '.pending'}`}>⏳</div>
            </div>
            <div className={styles.statValue}>{stats.ordersByStatus.pending}</div>
            <div className={styles.statChange}>คำสั่งซื้อที่ต้องดำเนินการ</div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Orders Section */}
        <div className={styles.ordersSection}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>📋 จัดการคำสั่งซื้อ</h2>
            <div className={styles.filters}>
              <input
                type="text"
                placeholder="ค้นหาคำสั่งซื้อ..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className={styles.statusFilter}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">ทุกสถานะ</option>
                <option value="pending">รอดำเนินการ</option>
                <option value="waiting_payment">รอการชำระเงิน</option>
                <option value="processing">กำลังดำเนินการ</option>
                <option value="shipped">จัดส่งแล้ว</option>
                <option value="delivered">จัดส่งสำเร็จ</option>
                <option value="cancelled">ยกเลิก</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>เลขที่ออเดอร์</th>
                <th>ลูกค้า</th>
                <th>วันที่</th>
                <th>สถานะ</th>
                <th>ยอดรวม</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.orderRow}>
                  <td className={styles.orderNumber}>{order.orderNumber}</td>
                  <td className={styles.customerName}>
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className={styles.totalAmount}>฿{order.total.toLocaleString()}</td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.viewButton}`}
                        onClick={() => openOrderModal(order)}
                      >
                        ดู
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              ก่อนหน้า
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`${styles.paginationButton} ${currentPage === i + 1 ? styles.active : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={styles.paginationButton}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              ถัดไป
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className={styles.sidebar}>
          {/* Recent Orders */}
          {stats && (
            <div className={styles.recentOrders}>
              <h3>📦 คำสั่งซื้อล่าสุด</h3>
              {stats.recentOrders.map((order) => (
                <div key={order.id} className={styles.recentOrderItem}>
                  <div className={styles.recentOrderNumber}>{order.orderNumber}</div>
                  <div className={styles.recentOrderCustomer}>{order.customerName}</div>
                  <span className={`${styles.recentOrderStatus} ${styles.recentOrderStatus + '.' + order.status}`}>
                    {getStatusText(order.status)}
                  </span>
                  <div className={styles.recentOrderTotal}>฿{order.total.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>รายละเอียดคำสั่งซื้อ</h2>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
            </div>

            <div className={styles.orderDetails}>
              {/* Customer Info */}
              <div>
                <h3>ข้อมูลลูกค้า</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ชื่อ:</span>
                  <span className={styles.detailValue}>
                    {selectedOrder.customerInfo.firstName} {selectedOrder.customerInfo.lastName}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>อีเมล:</span>
                  <span className={styles.detailValue}>{selectedOrder.customerInfo.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>เบอร์โทร:</span>
                  <span className={styles.detailValue}>{selectedOrder.customerInfo.phone}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ที่อยู่:</span>
                  <span className={styles.detailValue}>{selectedOrder.customerInfo.address}</span>
                </div>
              </div>

              {/* Order Status */}
              <div>
                <h3>สถานะคำสั่งซื้อ</h3>
                <select
                  className={styles.statusSelect}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  disabled={updatingStatus}
                >
                  <option value="pending">รอดำเนินการ</option>
                  <option value="waiting_payment">รอการชำระเงิน</option>
                  <option value="processing">กำลังดำเนินการ</option>
                  <option value="shipped">จัดส่งแล้ว</option>
                  <option value="delivered">จัดส่งสำเร็จ</option>
                  <option value="cancelled">ยกเลิก</option>
                </select>
              </div>

              {/* Order Items */}
              <div>
                <h3>รายการสินค้า</h3>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className={styles.itemImage}
                        />
                      )}
                      <div className={styles.itemDetails}>
                        <div className={styles.itemName}>{item.productName}</div>
                        <div className={styles.itemMeta}>
                          {item.productDescription} • ไซส์ {item.size} • {item.quantity} ชิ้น
                        </div>
                      </div>
                      <div className={styles.itemPrice}>
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3>ข้อมูลการชำระเงิน</h3>
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentInfoRow}>
                    <span className={styles.paymentInfoLabel}>ธนาคาร:</span>
                    <span className={styles.paymentInfoValue}>{selectedOrder.paymentInfo?.bankName || '-'}</span>
                  </div>
                  <div className={styles.paymentInfoRow}>
                    <span className={styles.paymentInfoLabel}>ชื่อบัญชี:</span>
                    <span className={styles.paymentInfoValue}>{selectedOrder.paymentInfo?.accountName || '-'}</span>
                  </div>
                  <div className={styles.paymentInfoRow}>
                    <span className={styles.paymentInfoLabel}>เลขที่บัญชี:</span>
                    <span className={styles.paymentInfoValue}>{selectedOrder.paymentInfo?.accountNumber || '-'}</span>
                  </div>
                  
                  {editingPayment ? (
                    <div>
                      <input
                        type="text"
                        placeholder="ธนาคาร"
                        className={styles.paymentInput}
                        value={paymentInfo.bankName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, bankName: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="ชื่อบัญชี"
                        className={styles.paymentInput}
                        value={paymentInfo.accountName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, accountName: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="เลขที่บัญชี"
                        className={styles.paymentInput}
                        value={paymentInfo.accountNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, accountNumber: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="QR Code URL"
                        className={styles.paymentInput}
                        value={paymentInfo.qrCodeUrl}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, qrCodeUrl: e.target.value })}
                      />
                      <button
                        className={styles.saveButton}
                        onClick={handlePaymentInfoUpdate}
                        disabled={editingPayment}
                      >
                        บันทึกข้อมูลการชำระเงิน
                      </button>
                    </div>
                  ) : (
                    <button
                      className={styles.saveButton}
                      onClick={() => setEditingPayment(true)}
                    >
                      แก้ไขข้อมูลการชำระเงิน
                    </button>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3>สรุปคำสั่งซื้อ</h3>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ราคาสินค้า:</span>
                  <span className={styles.detailValue}>฿{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ค่าจัดส่ง:</span>
                  <span className={styles.detailValue}>฿{selectedOrder.shippingCost.toLocaleString()}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>ยอดรวมทั้งหมด:</span>
                  <span className={styles.detailValue}>฿{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}