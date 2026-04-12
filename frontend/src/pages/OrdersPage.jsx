/**
 * OrderSuccessPage.jsx  —  Trang xác nhận đơn hàng thành công
 * OrdersPage.jsx        —  Danh sách đơn hàng của tôi
 */

import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { orderAPI, paymentAPI } from '../api';
import { formatCurrency, formatDate, ORDER_STATUS, PAYMENT_STATUS } from '../utils/format';
import styles from './OrdersPage.module.css';

/* ══════════════════════════════════════════
   ORDER SUCCESS PAGE
   ══════════════════════════════════════════ */
export function OrderSuccessPage() {
  const { orderId }   = useParams();
  const [params]      = useSearchParams();
  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    orderAPI.getById(orderId)
      .then(res => setOrder(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className={styles.successPage}>
        <div className={styles.spinner}/>
      </div>
    );
  }

  return (
    <div className={styles.successPage}>
      <div className={styles.successCard}>
        {/* Icon */}
        <div className={styles.successIcon}>
          <svg width="40" height="40" fill="none" stroke="white" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>

        <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
        <p className={styles.successSubtitle}>
          Cảm ơn bạn đã tin tưởng LapStore. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        </p>

        {order && (
          <div className={styles.orderInfo}>
            <div className={styles.orderInfoRow}>
              <span>Mã đơn hàng</span>
              <strong>{order.orderCode}</strong>
            </div>
            <div className={styles.orderInfoRow}>
              <span>Tổng tiền</span>
              <strong>{formatCurrency(order.finalAmount)}</strong>
            </div>
            <div className={styles.orderInfoRow}>
              <span>Phương thức</span>
              <strong>{order.paymentMethod?.toUpperCase()}</strong>
            </div>
            <div className={styles.orderInfoRow}>
              <span>Trạng thái</span>
              <span className={styles.statusBadge} style={{ color: ORDER_STATUS[order.status]?.color }}>
                {ORDER_STATUS[order.status]?.label || order.status}
              </span>
            </div>
          </div>
        )}

        <div className={styles.successActions}>
          <Link to={`/orders/${orderId}`} className={styles.trackBtn}>
            Theo dõi đơn hàng
          </Link>
          <Link to="/products" className={styles.continueBtn}>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MY ORDERS PAGE
   ══════════════════════════════════════════ */
export function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.spinner}/>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Đơn hàng của tôi</h1>

        {orders.length === 0 ? (
          <div className={styles.emptyOrders}>
            <p className={styles.emptyIcon}>📦</p>
            <h3>Bạn chưa có đơn hàng nào</h3>
            <Link to="/products" className={styles.shopBtn}>Mua sắm ngay</Link>
          </div>
        ) : (
          <div className={styles.orderList}>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── OrderCard ── */
function OrderCard({ order }) {
  const status   = ORDER_STATUS[order.status]   || { label: order.status,        color: '#888' };
  const payStatus = PAYMENT_STATUS[order.paymentStatus] || { label: order.paymentStatus, color: '#888' };

  return (
    <div className={styles.orderCard}>
      <div className={styles.orderCardHeader}>
        <div className={styles.orderMeta}>
          <span className={styles.orderCode}>{order.orderCode}</span>
          <span className={styles.orderDate}>{formatDate(order.createdAt, true)}</span>
        </div>
        <div className={styles.orderStatuses}>
          <span className={styles.statusPill} style={{ color: status.color, background: status.color + '18' }}>
            {status.label}
          </span>
          <span className={styles.statusPill} style={{ color: payStatus.color, background: payStatus.color + '18' }}>
            {payStatus.label}
          </span>
        </div>
      </div>

      <div className={styles.orderItems}>
        {order.items?.slice(0, 2).map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <img src={item.productImg || '/placeholder-laptop.jpg'} alt={item.productName}/>
            <div>
              <p className={styles.orderItemName}>{item.productName}</p>
              <p className={styles.orderItemMeta}>x{item.quantity} · {formatCurrency(item.unitPrice)}</p>
            </div>
          </div>
        ))}
        {order.items?.length > 2 && (
          <p className={styles.moreItems}>+{order.items.length - 2} sản phẩm khác</p>
        )}
      </div>

      <div className={styles.orderCardFooter}>
        <div>
          <span className={styles.totalLabel}>Tổng cộng: </span>
          <span className={styles.totalValue}>{formatCurrency(order.finalAmount)}</span>
        </div>
        <div className={styles.orderActions}>
          <Link to={`/orders/${order.id}`} className={styles.detailBtn}>Chi tiết</Link>
          {order.status === 'pending' && (
            <button className={styles.cancelBtn} onClick={() => orderAPI.cancel(order.id)}>
              Hủy đơn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
